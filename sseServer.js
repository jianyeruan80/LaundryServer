
  const express = require('express');
  const SSE = require('express-sse');
 
  const app = express();
  const sse = new SSE("Start", { serializeInitial: false });
 
  app.get('/', (req, res) => {
    res.end(`
        <html>
          <head>
            <title>express-sse demo</title>
            <style>
              @import url('https://fonts.googleapis.com/css?family=Raleway:900|Source+Code+Pro:300');
              body {
                width: 600px;
                margin: 20px auto 0;
                padding: 0;
                font-family: 'Source Code Pro', monospace;
                font-weight: 500;
                background-color: #eee;
                color: #333;
              }
              header {
                text-align: center;
                font-family: 'Source Code Pro', monospace;
                font-size: 2em;
                padding-bottom: 20px;
              }
              div {
                text-align: center;
              }
              a {
                font-family: 'Raleway', sans-serif;
                color: #333;
                transition: color 0.3s;
              }
              a:hover {
                color: indianred;
              }
            </style>
          </head>
          <body>
            <header>// express-sse demo</header>
            <div>
              <a href="/dropInit">Drop Initial Data</a> | <a href="/setInit">Update Initial Data</a> | <a href="_src">View Source</a>
            </div>
            <ul id="list">
            </ul>
            <script>
              var es = new EventSource('/stream');
              var list = document.querySelector('#list');
 
              es.onmessage = function (event) {
                var item = document.createElement('li');
                item.innerText = 'id: ' + event.lastEventId + ' â ' + event.data;
                list.appendChild(item);
              };
 
              es.addEventListener('customEvent', function (event) {
                var item = document.createElement('li');
                item.innerText = 'id: ' + event.lastEventId + ' â ' + event.data;
                list.appendChild(item);
              });
            </script>
          </body>
        </html>
      `);
  });
 
 app.get('/stream', sse.init);

app.get('/abc', function (req, res) {
     sse.send(123);
});

 /*	
  app.get('/dropInit', (req, res) => {
    sse.dropInit();
    res.redirect('/');
  });*/
 
/*  app.get('/setInit', (req, res) => {
    sse.send(123);
    res.redirect('/');
  });*/
 
	/*  setInterval(() => {
	    sse.send(123);
	  }, 1000);
	 
	  setInterval(() => {
	    sse.send({ x: 2, y: 3 }, 'customEvent', 'xxx');
	  }, 2000);*/
 
  app.listen(3000);
 