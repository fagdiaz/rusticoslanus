const admin = require('firebase-admin');

// Initialize Firebase Admin if it has not been initialized yet.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.addMessage = async (req, res) => {
  try {
    const {
      uidRemitente,
      emailRemitente,
      uidDestinatario,
      emailDestinatario,
      texto,
    } = req.body || {};

    if (
      !uidRemitente ||
      !emailRemitente ||
      !uidDestinatario ||
      !emailDestinatario ||
      !texto
    ) {
      return res.status(400).json({
        res: 'error',
        msg: 'Faltan datos obligatorios para mensaje privado',
      });
    }

    const timestamp = Date.now();
    const [a, b] = [uidRemitente, uidDestinatario].sort();
    const conversationId = `${a}_${b}`;
    const mensajesRef = db.collection('mensajes');

    const docRef = await mensajesRef.add({
      uidRemitente,
      emailRemitente,
      uidDestinatario,
      emailDestinatario,
      texto,
      timestamp,
      conversationId,
      tipo: 'privado',
    });

    return res.status(201).json({ res: 'ok', id: docRef.id, timestamp });
  } catch (error) {
    console.error('Error addMessage:', error);
    return res
      .status(500)
      .json({ res: 'fail', msg: 'Error al guardar mensaje' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { uidActual, uidOtro } = req.query || {};
    const parsedLimit = parseInt(req.query?.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50;

    if (!uidActual || !uidOtro) {
      return res.status(400).json({
        res: 'error',
        msg: 'Faltan uidActual o uidOtro para chat privado',
      });
    }

    const [a, b] = [uidActual, uidOtro].sort();
    const conversationId = `${a}_${b}`;

    const snapshot = await db
      .collection('mensajes')
      .where('conversationId', '==', conversationId)
      .orderBy('timestamp', 'asc')
      .limit(limit)
      .get();

    const mensajes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error getMessages:', error);
    return res
      .status(500)
      .json({ res: 'fail', msg: 'Error al obtener mensajes' });
  }
};
