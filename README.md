<h1>Full Stack Chat Application</h1>

<h3>How to run?</h3>
<ul>
  <li>Go to the <code>server</code> folder, and run <code>install_deps.bat</code> to install all the dependencies.</kli>
  <li>Then navigate to into the <code>src</code> folder</li>
  <li>Run <code>run.bat</code>, and it will start a express API server on <code>localhost:5000</code> (you can change this in config.json, but I suggest you don't, as you'll have to change the port manually in the other js files in the client directory aswell.)</li>
  <li>Go to the <code>client</code> folder, and run index.html, by double clicking on it, or any other method.</li>
  <li>Enjoy :)</li>
</ul>

<h3>How to deploy API?</h3>
<ul>
  <li>Download the <a  href="https://devcenter.heroku.com/articles/heroku-cli">heroku CLI</a></kli>
  <li>Download <a href="https://git-scm.com/downloads">Git</a> (Make sure to 'add to PATH')</li>
  <li>Once downloaded, open up your terminal and type <code>heroku login</code></li>
  <li>Make a new file called <code>Procfile</code> (with no extension) and in that file, type <code>web: node index.js</code></li>
  <li>Make sure to change the port of your express API to <code>process.env.PORT</code></li>
  <li>You must have the <code>node_modules</code> folder when deploying.</li>
  <li>Open a new terminal and navigate to the directory with the API in it.</li>
  <li>Type <code>git init</code></li>
  <li>Type <code>git add .</code></li>
  <li>Type <code>git commit -m "anything you want, or you could just leave this as is"</code></li>
  <li>Type <code>heroku create</code> or <code>heroku create {any name you would like</code></li>
  <li>Then type <code>git push heroku main</code>, if that doesn't work type <code>git push heroku master</code></li>
</ul>

If you have any queries, contact me on discord Mutyyab.#4275.
