# really-simple-syndication
Parse Really Simple Syndication (RSS 2.0)

## install
```bash
npm install really-simple-syndication
```

## usage
```js
import { parse } from "really-simple-syndication";

const xml = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>RSS Title</title>
    <description>This is an example of an RSS feed</description>
    <link>http://www.example.com/main.html</link>
    <copyright>2020 Example.com All rights reserved</copyright>
    <lastBuildDate>Mon, 6 Sep 2010 00:01:00 +0000</lastBuildDate>
    <pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>
    <ttl>1800</ttl>
    <item>
      <title>Example entry</title>
      <description>Here is some text containing an interesting description.</description>
      <link>http://www.example.com/blog/post/1</link>
      <guid isPermaLink="false">7bd204c6-1655-4c27-aeee-53f933c5395f</guid>
      <pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>
    </item>
  </channel>
</rss>
`;

parse(xml);
{
  copyright: "2020 Example.com All rights reserved",
  description: "This is an example of an RSS feed",
  link: "http://www.example.com/main.html",
  title: "RSS Title",
  lastBuildDate: 2010-09-06T00:01:00.000Z, // Date object
  pubDate: 2009-09-06T16:20:00.000Z, // Date object
  ttl: 1800,
  items: [
    {
      xml: '<item>\n  <title>Example entry</title>\n...', // raw XML as string
      description: "Here is some text containing an interesting description.",
      guid: { guid: "7bd204c6-1655-4c27-aeee-53f933c5395f", isPermaLink: false },
      link: "http://www.example.com/blog/post/1",
      pubDate: 2009-09-06T16:20:00.000Z, // Date object
      title: "Example entry"
    }
  ]
}
```