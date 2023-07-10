const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, './src')));

app.use(cors({
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}));


app.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    // Aquí debes agregar la lógica para validar el correo electrónico y la contraseña
    // y generar el token si son válidos
  
    // Ejemplo de generación de un token JWT usando el paquete 'jsonwebtoken'
    const jwt = require('jsonwebtoken');
    const secretKey = 'mi_clave_secreta';
  
    if (email === 'usuario@example.com' && password === 'password') {
      const token = jwt.sign({ email }, secretKey);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './src/index.html'));
});

app.listen(3000, () => {
  console.log('Servidor Node.js iniciado en el puerto 3000');
});