*********** Project ***********

1) Creating an Express Application

Run the initializer to crate mongo database " node initialize.js "
created database : gallery.json

Before running the server : node server.js
    - executed the command "npm init"
    - created a "package.json"
    - install Express "npm install express"
    - install mongodb "npm install mongodb"
    - install pug "npm install pug"
    - "package.json" as a dependency.
    - Run the server code
    - Home page shows "http://localhost:3000/" and "http://localhost:3000/


Routes:
Get/artworks
    - renders the homepage with all artworks and details
    - response is  html
    is working
Get/artists
    - renders the homepage with all arttists and details
    - response is  html
    is working
Get/users
    - renders the homepage with all users and details
    - response is  html
    errors


Get/artwork/:id
    - renders display artwork on seperate page
    - response is  html
    is working
Get/artist/:id
    - renders display artist on seperate page
    - response is  html
    is working
Get/user/:id
    - renders display user on seperate page
    - response is  html
    errors
Get/addArtwork
    - renders display artwork on seperate page
    - response is  html

Post/
    - create new Artwork - is working
    - create new Artist - partially working
    - create new user - error

Files included

database 
          - gallery.json
Public
          - addUser.js
          - artistRouter.js
          - artWorkRouter.js
           - style.css - not use
          -deleteUser.js
          -register.js
          - login.js
          -userRouter.js

views
          - addUser.pug
          - artist.pug
          - artists.pug
          - artwork.pug
          - artworks.pug
          - headers.pug
          - home.pug
          - login.pug
          - newartist.pug
          - newartwork.pug
          - newuser.pug
          - register.pug 
          - user.pug
          - users.pug

initializer.js
server.js
README.txt
Report.pdf - is opening in VS code
youtube video link is

" https://youtu.be/2VgY-fQv8Oc "


