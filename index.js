const getAttribute = require("xml-utils/get-attribute.js");
const findTagByName = require("xml-utils/find-tag-by-name.js");
const findTagsByName = require("xml-utils/find-tags-by-name.js");
const findTagByPath = require("xml-utils/find-tag-by-path.js");
const findTagsByPath = require("xml-utils/find-tags-by-path.js");
const removeTagsByName = require("xml-utils/remove-tags-by-name.js");

const CHANNEL_TEXT_TAGS = [
  "copyright",
  "dc:publisher",
  "description",
  "itunes:explicit",
  "itunes:subtitle",
  "itunes:summary",
  "language",
  "link",
  "managingEditor",
  "title",
  "webMaster"
];
const CHANNEL_DATE_TAGS = ["lastBuildDate", "pubDate"];
const CHANNEL_NUM_TAGS = ["ttl"];

const CHANNEL_TAGS = CHANNEL_TEXT_TAGS.concat(CHANNEL_DATE_TAGS).concat(CHANNEL_NUM_TAGS).concat(["image"]);

const rss = {};

function titlecase(str) {
  return str[0].toUpperCase() + str.substring(1);
}

const getAttributes = function (xml, attributes) {
  const result = {};
  for (let i = 0; i < attributes.length; i++) {
    const key = attributes[i];
    const value = getAttribute(xml, key);
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

function findTagText(xml, path, options) {
  const trim = options && options.trim === false ? false : true;
  const tag = findTagByPath(xml, path, { debug: options && options.debug });
  if (tag) {
    let inner = tag.inner;
    if (typeof inner === "string" && trim) inner = inner.trim();
    return inner;
  }
}

function findTagDate(xml, path, options) {
  const trim = options && options.trim === false ? false : true;
  const tag = findTagByPath(xml, path, { debug: options && options.debug });
  if (tag) {
    let inner = tag.inner;
    if (typeof inner === "string" && trim) inner = inner.trim();
    if (options && options.raw === true) {
      return inner;
    } else {
      return new Date(tag.inner);
    }
  }
}

function findTagNum(xml, path, options) {
  const trim = options && options.trim === false ? false : true;
  const tag = findTagByPath(xml, path, { debug: options && options.debug });
  if (tag) {
    let inner = tag.inner;
    if (typeof inner === "string" && trim) inner = inner.trim();
    if (options && options.raw === true) {
      return inner;
    } else {
      return parseFloat(inner);
    }
  }
}

CHANNEL_TEXT_TAGS.forEach(function (tagName) {
  const funcname = "findChannel" + titlecase(tagName);
  rss[funcname] = function (xml, options) {
    return findTagText(xml, ["channel", tagName], options);
  };
});

CHANNEL_DATE_TAGS.forEach(function (tagName) {
  const funcname = "findChannel" + titlecase(tagName);
  rss[funcname] = function (xml, options) {
    return findTagDate(xml, ["channel", tagName], options);
  };
});

CHANNEL_NUM_TAGS.forEach(function (tagName) {
  const funcname = "findChannel" + titlecase(tagName);
  rss[funcname] = function (xml, options) {
    return findTagNum(xml, ["channel", tagName], options);
  };
});

rss.findItems = function (xml) {
  return findTagsByPath(xml, ["channel", "item"]).map(function (tag) {
    return tag.outer;
  });
};

rss.findChannelImage = function (xml) {
  // ignore any image tags found within items
  const top = removeTagsByName(xml, "item");

  const tag = findTagByPath(top, ["channel", "image"]);
  if (!tag) return;

  const result = {};
  ["description", "height", "link", "title", "url", "width"].forEach(function (tagName) {
    const text = findTagText(tag.inner, [tagName]);
    if (text) {
      result[tagName] = text;
    }
  });

  return result;
};

["author", "description", "link", "title"].forEach(function (tagName) {
  const funcname = "findItem" + titlecase(tagName);
  rss[funcname] = function (xml, options) {
    return findTagText(xml, ["item", tagName], options);
  };
});

["pubDate"].forEach(function (tagName) {
  const funcname = "findItem" + titlecase(tagName);
  rss[funcname] = function (xml, options) {
    return findTagDate(xml, ["item", tagName], options);
  };
});

["geo:lat", "geo:long"].forEach(function (tagName) {
  const funcname = "findItem" + titlecase(tagName);
  rss[funcname] = function (xml, options) {
    return findTagNum(xml, ["item", tagName], options);
  };
});

rss.findItemGuid = function (xml, options) {
  const trim = options && options.trim === false ? false : true;
  const tag = findTagByPath(xml, ["guid"], { debug: options && options.debug });
  if (tag) {
    let inner = tag.inner;
    if (typeof inner === "string" && trim) inner = inner.trim();
    const result = { guid: inner };

    const isPermaLink = getAttribute(tag.outer, "isPermaLink");
    if (isPermaLink) {
      result.isPermaLink = isPermaLink.toLowerCase() === "true";
    }

    return result;
  }
};

rss.parse = function parse(xml, options) {
  const result = {};

  const top = removeTagsByName(xml, "item");

  CHANNEL_TAGS.forEach(tagName => {
    const funcname = "findChannel" + titlecase(tagName);
    const value = rss[funcname](top, options);
    if (value !== undefined) {
      result[tagName] = value;
    }
  });

  result.items = rss.findItems(xml).map(item => {
    const result = {
      xml: item
    };
    ["author", "description", "geo:lat", "geo:long", "guid", "link", "pubDate", "title"].forEach(key => {
      const funcname = "findItem" + titlecase(key);
      if (!rss[funcname]) throw Error("missing " + funcname);
      const value = rss[funcname](item, options);
      if (Array.isArray(value) ? value.length !== 0 : value !== undefined) {
        result[key] = value;
      }
    });
    return result;
  });

  return result;
};

module.exports = rss;
