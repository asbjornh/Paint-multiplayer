const port = process.env.port || 3000;

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const Coordinator = require('./server/coordinator');
const coordinator = new Coordinator(io);

const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

// TODO: remove this ?
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.post('/api/join-game', (req, res) => {
  res.json({ isSuccess: req.body && coordinator.addPlayerToGame(req.body) });
});

app.get('/api/create-game', (req, res) => {
  res.json({ gameCode: coordinator.createGame() });
});

app.post('/api/start-game', (req, res) => {
  coordinator.startGame(req.body.gameCode, req.body.difficulty);
  res.json({});
});

app.post('/api/start-new-game', (req, res) => {
  coordinator.startNewGame(req.body.gameCode);
  res.json({});
});

app.post('/api/start-round', (req, res) => {
  coordinator.startRound(req.body.gameCode);
  res.json({});
});

app.post('/api/submit-page', (req, res) => {
  req.body && coordinator.submitPage(req.body);
  res.json({});
});

app.post('/api/submit-rating', (req, res) => {
  req.body && coordinator.submitRating(req.body);
  res.json({});
});

app.get(/^(.+)$/, (req, res) => {
  res.sendFile(__dirname + '/build/' + req.params[0]);
});

http.listen(port, () => {
  console.log('listening on ' + port);
});

io.on('connection', socket => {
  socket.emit('get-socket-id', socket.id);
});
