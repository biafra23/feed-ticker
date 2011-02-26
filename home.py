# -*- coding: utf-8 -*-

from google.appengine.api import urlfetch
from cgi import parse_qs, escape
import feedparser
import time
import urllib
import wsgiref.handlers

top = """
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>
      Headlines
    </title>
    <link rel="stylesheet" type="text/css" href="css/plasma.css" />
    <script type="text/javascript" src="js/prototype.js"></script>
    <script type="text/javascript" src="js/scriptaculous.js"></script>
    <script src="js/fade.js" type="text/javascript"><!-- --></script>
  </head>
  <body>
    <script type="text/javascript">
    function getFeed(){
"""

bottom = """
    }

    window.onload=function(){
         new ticker(utf8unescape(getFeed().replace(/\+/g,  " ")), "ticker1", 5000, "fade");
    }

    var sURL = unescape(window.location.pathname + window.location.search);

    setTimeout( "refresh()", 300*1000 );

    function refresh() {
      window.location.replace( sURL );
    }
    </script>
    <div id="ticker1"></div>
  </body>
  </html>
"""


def parsefeed( url ) :
    output = []
    result = urlfetch.fetch(url)
    if result.status_code == 200:
       encoded = unicode(result.content, errors='ignore') 
       feed = feedparser.parse(encoded) 
       oddeven = 0
       for entry in feed['entries']:
 	    output.append('<div class="message">')
            output.append('<div class="colour' + str(oddeven%2 + 1)+ '">')
            oddeven += 1
	    output.append('<div class="headline">')
	    output.append(entry.title)
	    output.append('</div>')
            output.append('<div class="h-date">')
            output.append(time.strftime("%d %B %Y", entry.updated_parsed))
 	    output.append('</div>')
            output.append('<div class="detail">')
            output.append(entry.summary)
            output.append('</div>')
            output.append('</div>')
            output.append('</div>')
       return output

def application(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    
    if 'feed' in parameters:
        feedurl = escape(parameters['feed'][0])
    else:
        
#        feedurl = 'http://feedparser.org/docs/examples/atom10.xml'
        feedurl = 'http://www.spiegel.de/schlagzeilen/index.rss'
#        feedurl = 'http://news.ycombinator.com/rss'
#        feedurl = 'http://blog.fefe.de/rss.xml'
#        feedurl = 'http://itn.co.uk/rss/index.rss'

    status = '200 OK'
    output = parsefeed(feedurl)
    response_headers = [('Content-type', 'text/html')]
    start_response(status, response_headers)
    out = top + 'return "' + urllib.quote(''.join(output)) + '";' + bottom
    return [out]

def go():
  wsgiref.handlers.CGIHandler().run(application)

if __name__ == "__main__":
  go() 


