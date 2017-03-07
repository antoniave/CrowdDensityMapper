# CrowdDensityMapper

The application "Crowd Density Mapper" was developed in the context of the course 
"Advanced Geospatial Web Technologies" at the University of Münster.<br>
With the app the following issue is addressed: 
"Several areas around a stadium are often crowded before and after football games. 
The app can allow the user to view and potentially avoid these crowded areas by analyzing 
volunteered smartphone trajectories."

###Components
For the execution of the application, three components are needed: A Web Processing Service,
a spatial database, and a front-end. This repository contains the code for the **front-end component**.
The code for the database component can be found here: https://github.com/LEinfeldt/AdvancedGeoWeb<br>

###Front-end
The front-end is based on *HTML*, *CSS*, *JavaScript*, and *PHP*. 
It has a responsive design (using *Bootstrap*) and was developed for usage in Chrome (mobile and desktop).
During the project, the application was hosted on an *Apache2* server. 

The Application consists of two pages. One page is an "About" page showing important information and hints.
The other one is the main page and shows a *leaflet* map with different layers. 
One layer displays a density map, processed by the Web Processing Service. 
A time-slider can be used to examine the temporal progress of the density.
 
For calculating the density of the crowd, the users coordinates are used. 
For this reason, the user of the app is requested to activate the GPS device in his smartphone and allow 
the applicaton to use his actual location. 
If the user does not allow the usage of the location he can't use the application.

