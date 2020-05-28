<h1>This webpage was created with the purpose to work as an event manager and social webpage</h1>
<h2>The Application</h2>
<h3>Account</h3>
<p>New user are able to register a new account and returning users can login and access their stored information.
The account is used to store important information to suugest events after the home page has loaded and is used to store events that are created by the user or added as favorites.</p>
<p>The top menu has section called "Account" that has 4 options: "View my account", "Change my information", "Sign Out" and "Delete my account". As the title suggest, this options enables the users to see their stored information, 
modify it and if they want, remove their account. </p>
<h3>Home Page</h3>
<p>The home page will display several options to search events: get all, search by keyword, search by title or tag, 
search by date interval and search by proximity. After a search is done and after the page loads (with events suggested by the tags of the user) the events will appear in the righmost section and the locations will be displayed on the map in the middle. If it is a mobile device this will happen in a column structure. The user is able to interact with the map and remove the infowindows of events and he or she can also access each event by clicking on
"see event" that appears below each event information. It is important to mention that all this searches will only be valid for public events or private events owned by the user. Private events can only be accessed by other users if they are invited and can be found in "My events section."</p>
<h3>Events</h3>
<p>Once the users enters an specific event, he or she will be able to add comments, and if he or she is the owner, he or she will be able to invite other users.
The top menu on the section "Events" also offers 5 options to interact with events: "View my events", "View my favorites", "Create an event", "Modify an event" and "Delete an event". In a similar fashion as accounts, events can be created freely, and they can be deleted or modified at any time. If the person that should be invited doesn't have an account, the email address can be introduced and a email will be send with some information of the event. </p>
<h3>About us</h3>
<p>This a simple page that relates the origin of this project </p>
<h3>Contact us</h3>
<p>In this page users can send any inquery, comment or report by filling the information and a email will be directly sent to an email account dedicated for the webpage. </p>
<h2>Back End</h2>
<p>The back End of this webpage is composed of three databases: one for the users, other for the events 
and one for the comments. An user can have multiple events and events also have comments.</p>
<p>Most of the endpoints are protected and can only be accessed by a token provided once the user
logs in.Yet, one endpoint that can be used outside the application is the GET with the url: 
https://frozen-falls-96496.herokuapp.com/event-manager/eventss . This will give a general idea of 
what elements make an event.  </p>


