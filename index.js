const express = require('express');

const server = express();

const projects = [
  {
    id: 0,
    title: 'Projeto padrão',
    tasks: ['Tarefa default']
  },
  {
    id: 1,
    title: 'Projeto padrão1',
    tasks: ['Tarefa default1']
  }
];

let reqCount = 0;

server.use(express.json());

function countReq(req, res, next) {
  console.log(`Number of requests: ${++reqCount}`);
  return next();
}

server.use(countReq);

function verifyID(req, res, next) {
  const { id } = req.params;

  let idx = projects.findIndex(el => el.id == id);

  if (idx === -1) return res.status(400).json({ error: 'Project does not exists' });

  req.idx = idx;

  return next();

}

server.post('/projects', (req, res) => {
  const { title } = req.body;
  const id = projects.length > 0 ? projects[projects.length - 1].id + 1 : 0;
  projects.push({
    id,
    title,
    tasks: []
  });
  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', verifyID, (req, res) => {

  projects[req.idx].title = req.body.title;

  return res.json(projects[req.idx]);
});

server.delete('/projects/:id', verifyID, (req, res) => {

  projects.splice(req.idx, 1);

  return res.send(projects);
});

server.post('/projects/:id/tasks', verifyID, (req, res) => {

  projects[req.idx].tasks.push(req.body.title);

  return res.json(projects[req.idx]);
});

server.listen(3000);