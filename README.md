Hi, nice to meet you. I am the gds-direct-nodejs app.

You can inject me on a page in your project to give user access to a GDS (Apollo, Sabre, Galileo or Amadeus).

Since I'm hosted on node js, it is possible for server to preserve the http connection with GDS service endpoint resulting in 3 times faster response on a sequential command call.

It is basically a terminal where user enters commands and receives a GDS formatted response. What these commands usually do is searching flights in
airline databases to build the itinerary requested by customer, booking the reservation, issuing the tickets, charging credit cards, refunding, etc...

When injecting this terminal in your project, you should keep in mind that some user actions may be destructive, for example if user books the reservation and forgets to cancel it later, or if he modifies a ticketed PNR.
There are mechanisms in this app that check agent roles and stuff, but they do not cover _all_ possible formats in every GDS, so it's possible (even though not likely) for any agent to do something bad.
