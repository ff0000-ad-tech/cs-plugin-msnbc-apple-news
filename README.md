##### RED Interactive Agency - Ad Technology

[![npm (tag)](https://img.shields.io/npm/v/@ff0000-ad-tech%2Fcs-plugin-msnbc-apple-news.svg?style=flat-square)](https://www.npmjs.com/package/@ff0000-ad-tech%2Fcs-plugin-msnbc-apple-news)
[![GitHub issues](https://img.shields.io/github/issues/ff0000-ad-tech/cs-plugin-msnbc-apple-news.svg?style=flat-square)](https://github.com/ff0000-ad-tech/cs-plugin-msnbc-apple-news)
[![npm downloads](https://img.shields.io/npm/dm/@ff0000-ad-tech%2Fcs-plugin-msnbc-apple-news.svg?style=flat-square)](https://www.npmjs.com/package/@ff0000-ad-tech%2Fcs-plugin-msnbc-apple-news)

[![GitHub contributors](https://img.shields.io/github/contributors/ff0000-ad-tech/cs-plugin-msnbc-apple-news.svg?style=flat-square)](https://github.com/ff0000-ad-tech/cs-plugin-msnbc-apple-news/graphs/contributors/)
[![GitHub commit-activity](https://img.shields.io/github/commit-activity/y/ff0000-ad-tech/cs-plugin-msnbc-apple-news.svg?style=flat-square)](https://github.com/ff0000-ad-tech/cs-plugin-msnbc-apple-news/commits/master)
[![npm license](https://img.shields.io/npm/l/@ff0000-ad-tech%2Fcs-plugin-msnbc-apple-news.svg?style=flat-square)](https://github.com/ff0000-ad-tech/cs-plugin-msnbc-apple-news/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

# Creative Server Plugin - Apple News Responsive Ad Builder

This plugin is to assist with building ads to deploy on Apple News.
This means that they must resize to the size associated with the Apple device and orientation defined by the [Apple News HTML spec](https://developer.apple.com/news-publisher/News-Ad-Specifications.pdf).				

There are two main Apple News sizes: the **Double Banner** and the **Large Banner**.

For both, you would choose two sizes to designate as either the **Landscape** or **Portrait** creative.

Then the Apple News ad will use the size appropriate for the given device and orientation.

## Important Notes

- __If asked to built another Apple News creative, may be worth building out a size per device instead of just one creative that responds to every listed size__
  - then having the parent index choose among a given size instead of just landscape or portrait, like it's currently doing
- __When asked to make a specific size for Apple News (e.g. 1242x699 for Large Banners on iPhones 6-8), be sure to build it to the dimension in points__
  - so for the 1242x699 size, build it in __414x233__ instead b/c those are the dimensions of the iframe on that particular form factor

## How It Works

The ad's main `index.html` has an iframe that renders the appropriate size creative based on the device (iPhone 5, 6, X, etc.) and orientation (i.e. landscape vs. portrait).

To enable clickthrough on iOS apps such as the Apple News app, we need to use an `<a>` with the `href` set to the clickthrough URL. The parent `window` has a `message` listener that waits for data that looks something like this:

```js
{
	// key-value pair this index uses to update clickTag
	type: 'UPDATE_CLICKTAG', 
	// URL to set clickTag to
	message: 'http://msnbc.com/something'
}
```

In the Apple News Responsive Build Source (__TODO__), a `postClickTagURL()` function exists within the `index.html` which gets called in `AdData.js`. In `AdData`, you can call `postClickTagURL()` with the dynamic clickTag URL you need.

## Usage

- __In the Creative Server root interface:__
	1. Select the two sizes you'll need for your responsive creative (e.g. 1242x699 and 2208x699 for the Large Banner's portrait and landscape orientations, respectively)
	1. In the Plugins dropdown, select __MSNBC Apple News__ and hit the 🔥
- __On the plugin page__:
	1. Fill out the fields and choose the appropriate sizes for the landscape/portrait orientations
	1. Hit __Render Ad__ when ready
	1. You will get a prompt telling you that the ads have been built successfully
	1. files will be in the `_apple-news-output` directory of project root
		- _note about underscore in directory name: not having the underscore will cause a nested Creative Server to pop up_ 

