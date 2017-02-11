Created by Dave Smith (lah4life)

API Basejump: URL Shortener Microservice

## User Stories:

I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

When I visit that shortened URL, it will redirect me to my original link

##Example creation usage:

https://aqueous-savannah-48973.herokuapp.com/new/http://www.google.com

https://aqueous-savannah-48973.herokuapp.com/new/www.google.com

https://aqueous-savannah-48973.herokuapp.com/new/http://google.com

##Example creation output:

{"url":"http://www.google.com","shortURL":"https://aqueous-savannah-48973.herokuapp.com/7"}

##Usage:

https://aqueous-savannah-48973.herokuapp.com/7

##Will redirect to:

http://www.google.com