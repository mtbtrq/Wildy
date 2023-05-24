<h1>Wildy - A Full Stack Chat Application</h1>

<a href="https://imgur.com/a/nLYVhtn">Image Gallery</a>
<br />
<a href="https://private.up.railway.app/i/gn2h2">How To Use</a>

<h3>How to run?</h3>
<ul>
  <li>Go to the <code>backend</code> folder, and run <code>install_deps.bat</code> to install all the dependencies.</kli>
  <li>Then navigate into the <code>src</code> folder, and run <code>run.bat</code>. It will start an express API server on <code>localhost:5000</code></li>
  <li>Go to the <code>frontend</code> folder, and run <code>install_deps.bat</code> to install all the dependencies.</li>
  <li>Edit <code>config.json</code> in the folder to suit your needs, and finally, run <code>run.bat</code> to start the frontend server.</li>
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
  <li>Type <code>git commit -m "{anything you want, or you could just leave this as is}"</code></li>
  <li>Type <code>heroku create</code> or <code>heroku create {any name you would like to choose}</code></li>
  <li>Finally, type <code>git push heroku main</code>, if that doesn't work type <code>git push heroku master</code></li>
</ul>

<h3>How to deploy on Railway (much better option)</h3>
<p>Simply click the button below</p>

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/rPt4fy?referralCode=Ki33Dj)
