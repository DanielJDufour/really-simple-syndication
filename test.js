const fs = require("fs");
const test = require("flug");
const rss = require("./index.js");

const wikipedia = fs.readFileSync("./data/wikipedia.xml", "utf-8");
const georss_gml = fs.readFileSync("./data/georss-gml.xml", "utf-8");
const georss_w3c = fs.readFileSync("./data/georss-w3c.xml", "utf-8");

// Graphical Tropical Weather Outlooks from https://www.nhc.noaa.gov/aboutrss.shtml
const gtwo = fs.readFileSync("./data/gtwo.xml", "utf-8");
const noaa_podcast = fs.readFileSync("./data/noaa-podcast.xml", "utf-8");

test("wikipedia", ({ eq }) => {
  eq(rss.parse(wikipedia), {
    copyright: "2020 Example.com All rights reserved",
    description: "This is an example of an RSS feed",
    link: "http://www.example.com/main.html",
    title: "RSS Title",
    lastBuildDate: new Date("2010-09-06T00:01:00.000Z"),
    pubDate: new Date("2009-09-06T16:20:00.000Z"),
    ttl: 1800,
    items: [
      {
        xml:
          '<item>\n  <title>Example entry</title>\n  <description>Here is some text containing an interesting description.</description>\n  <link>http://www.example.com/blog/post/1</link>\n  <guid isPermaLink="false">7bd204c6-1655-4c27-aeee-53f933c5395f</guid>\n  <pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>\n </item>',
        description: "Here is some text containing an interesting description.",
        guid: { guid: "7bd204c6-1655-4c27-aeee-53f933c5395f", isPermaLink: false },
        link: "http://www.example.com/blog/post/1",
        pubDate: new Date("2009-09-06T16:20:00.000Z"),
        title: "Example entry"
      }
    ]
  });
});

test("georss: gml", ({ eq }) => {
  eq(rss.parse(georss_gml), {
    description: "One guy's view of Cambridge, Massachusetts",
    link: "http://maps.google.com",
    title: "Cambridge Neighborhoods",
    items: [
      {
        xml:
          '<item>\n      <guid isPermaLink="true">00000111c36421c1321d3</guid>\n      <pubDate>Thu, 05 Apr 2007 20:16:31 +0000</pubDate>\n      <title>Central Square</title>\n      <description>The heart and soul of the "new" Cambridge. Depending on where you \n               stand, you can feel like you\'re in the 1970s or 2020.</description>\n      <author>rajrsingh</author>\n      <georss:where>\n        <gml:Polygon>\n          <gml:exterior>\n            <gml:LinearRing>\n              <gml:posList>\n                +71.106216 42.366661\n                +71.105576 42.367104\n                +71.104378 42.367134\n                +71.103729 42.366249\n                +71.098793 42.363331\n                +71.101028 42.362541\n                +71.106865 42.366123\n                +71.106216 42.366661\n              </gml:posList>\n            </gml:LinearRing>\n          </gml:exterior>\n        </gml:Polygon>\n      </georss:where>\n    </item>',
        author: "rajrsingh",
        description:
          'The heart and soul of the "new" Cambridge. Depending on where you \n               stand, you can feel like you\'re in the 1970s or 2020.',
        guid: { guid: "00000111c36421c1321d3", isPermaLink: true },
        pubDate: new Date("2007-04-05T20:16:31.000Z"),
        title: "Central Square"
      }
    ]
  });
});

test("georss: w3c", ({ eq }) => {
  eq(rss.parse(georss_w3c), {
    "dc:publisher": "U.S. Geological Survey",
    description: "Real-time, worldwide earthquake list for the past 7 days",
    link: "https://earthquake.usgs.gov/eqcenter/",
    title: "USGS M5+ Earthquakes",
    pubDate: new Date("2007-12-28T07:56:15.000Z"),
    items: [
      {
        xml:
          "<item>\n       <pubDate>Fri, 28 Dec 2007 05:24:17 GMT</pubDate>\n       <title>M 5.3, northern Sumatra, Indonesia</title>\n       <description>December 28, 2007 05:24:17 GMT</description>\n       <link>https://earthquake.usgs.gov/eqcenter/recenteqsww/Quakes/us2007llai.php</link>\n       <geo:lat>5.5319</geo:lat>\n       <geo:long>95.8972</geo:long>\n     </item>",
        description: "December 28, 2007 05:24:17 GMT",
        "geo:lat": 5.5319,
        "geo:long": 95.8972,
        link: "https://earthquake.usgs.gov/eqcenter/recenteqsww/Quakes/us2007llai.php",
        pubDate: new Date("2007-12-28T05:24:17.000Z"),
        title: "M 5.3, northern Sumatra, Indonesia"
      }
    ]
  });
});

test("gtwo", ({ eq }) => {
  eq(rss.parse(gtwo), {
    copyright: "none",
    description: "National Hurricane Center Graphical Tropical Weather Outlooks",
    link: "https://www.nhc.noaa.gov/",
    title: "National Hurricane Center Graphical Tropical Weather Outlooks",
    webMaster: "nhcwebmaster@noaa.gov (NHC Webmaster)",
    language: "en-us",
    lastBuildDate: new Date("2023-04-09T10:26:32.000Z"),
    managingEditor: "nhcwebmaster@noaa.gov (NHC Webmaster)",
    pubDate: new Date("2023-04-09T10:26:32.000Z"),
    image: {
      description: "NOAA logo",
      height: "45",
      link: "https://www.nhc.noaa.gov/",
      title: "National Hurricane Center Graphical Tropical Weather Outlooks",
      url: "https://www.nhc.noaa.gov/images/xml_logo_nhc.gif",
      width: "95"
    },
    items: [
      {
        xml:
          "<item>\n<title>NHC Atlantic Outlook</title>\n<description>The Atlantic hurricane season runs from June 1st through November 30th.</description>\n<pubDate>Tue, 17 Jan 2023 09:51:06 GMT</pubDate>\n<link>https://www.nhc.noaa.gov/gtwo.php?basin=atlc</link>\n<guid>https://www.nhc.noaa.gov/gtwo.php?basin=atlc</guid>\n<author>nhcwebmaster@noaa.gov (NHC Webmaster)</author>\n</item>",
        author: "nhcwebmaster@noaa.gov (NHC Webmaster)",
        description: "The Atlantic hurricane season runs from June 1st through November 30th.",
        guid: {
          guid: "https://www.nhc.noaa.gov/gtwo.php?basin=atlc"
        },
        link: "https://www.nhc.noaa.gov/gtwo.php?basin=atlc",
        pubDate: new Date("2023-01-17T09:51:06.000Z"),
        title: "NHC Atlantic Outlook"
      },
      {
        xml:
          "<item>\n<title>NHC Eastern North Pacific Outlook</title>\n<description>The Eastern North Pacific hurricane season runs from May 15th through November 30th.</description>\n<pubDate>Fri, 02 Dec 2022 16:41:33 GMT</pubDate>\n<link>https://www.nhc.noaa.gov/gtwo.php?basin=epac</link>\n<guid>https://www.nhc.noaa.gov/gtwo.php?basin=epac</guid>\n<author>nhcwebmaster@noaa.gov (NHC Webmaster)</author>\n</item>",
        author: "nhcwebmaster@noaa.gov (NHC Webmaster)",
        description: "The Eastern North Pacific hurricane season runs from May 15th through November 30th.",
        guid: {
          guid: "https://www.nhc.noaa.gov/gtwo.php?basin=epac"
        },
        link: "https://www.nhc.noaa.gov/gtwo.php?basin=epac",
        pubDate: new Date("2022-12-02T16:41:33.000Z"),
        title: "NHC Eastern North Pacific Outlook"
      },
      {
        xml:
          "<item>\n<title>CPHC Central North Pacific Outlook</title>\n<description>The Central North Pacific hurricane season runs from June 1st through November 30th.</description>\n<pubDate>Fri, 02 Dec 2022 16:42:08 GMT</pubDate>\n<link>https://www.nhc.noaa.gov/gtwo.php?basin=cpac</link>\n<guid>https://www.nhc.noaa.gov/gtwo.php?basin=cpac</guid>\n<author>nhcwebmaster@noaa.gov (NHC Webmaster)</author>\n</item>",
        author: "nhcwebmaster@noaa.gov (NHC Webmaster)",
        description: "The Central North Pacific hurricane season runs from June 1st through November 30th.",
        guid: {
          guid: "https://www.nhc.noaa.gov/gtwo.php?basin=cpac"
        },
        link: "https://www.nhc.noaa.gov/gtwo.php?basin=cpac",
        pubDate: new Date("2022-12-02T16:42:08.000Z"),
        title: "CPHC Central North Pacific Outlook"
      }
    ]
  });
});

// missing itunes:owner
test("noaa_podcast", ({ eq }) => {
  eq(rss.parse(noaa_podcast), {
    copyright: "none",
    description: "National Hurricane Center Podcast",
    "itunes:explicit": "no",
    "itunes:subtitle": "National Hurricane Center Audio Media Briefings",
    "itunes:summary": "National Hurricane Center Audio Summary of Current Tropical Cyclone Impacts",
    language: "en-us",
    link: "https://www.nhc.noaa.gov/",
    managingEditor: "nhcwebmaster@noaa.gov (NHC Webmaster)",
    title: "National Hurricane Center Podcast",
    webMaster: "nhcwebmaster@noaa.gov (NHC Webmaster)",
    pubDate: new Date("2023-04-09T12:45:54.000Z"),
    image: {
      description: "NOAA logo",
      height: "45",
      link: "https://www.nhc.noaa.gov/",
      title: "National Hurricane Center Podcast",
      url: "https://www.nhc.noaa.gov/gifs/xml_logo_nhc.gif",
      width: "95"
    },
    items: [
      {
        xml:
          "<item>\n<title>NHC Audio Briefing not available</title>\n<description>NHC Audio Briefing not available</description>\n<pubDate>Mon, 16 May 2022 18:48:04 GMT</pubDate>\n<link>https://www.nhc.noaa.gov/audio</link>\n<guid>https://www.nhc.noaa.gov/audio</guid>\n<author>nhcwebmaster@noaa.gov (NHC Webmaster)</author>\n</item>",
        author: "nhcwebmaster@noaa.gov (NHC Webmaster)",
        description: "NHC Audio Briefing not available",
        guid: {
          guid: "https://www.nhc.noaa.gov/audio"
        },
        link: "https://www.nhc.noaa.gov/audio",
        pubDate: new Date("2022-05-16T18:48:04.000Z"),
        title: "NHC Audio Briefing not available"
      }
    ]
  });
});
