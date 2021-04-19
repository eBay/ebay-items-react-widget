# eBay Items Widget

Lightweight, responsive and fully customizable component for React applications to surface a rich selection of items for buyers.

**Note**: The item search is powered by [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html).

## Table of contents

  - [Motivation](#motivation)
  - [Features](#features)
  - [Usage](#usage)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
  - [Configure](#configure)
    - [Example](#example)
    - [Running the example](#running-the-example)
  - [API](#api)
  - [Note for Production deployment](#note-for-production-deployment)
  - [Logging](#logging)
  - [License](#license)

## Motivation

eBay Items Widget is a fully customizable React component that allows you to surface a rich collection of eBay items in your React application.

This component provides a responsive UI experience with four different layouts:

- **Single Item Carousel**: View for presenting data in a horizontally scrollable layout. You can swipe to move through a collection of items

<h1 align="center">
  <img src="https://user-images.githubusercontent.com/35708101/115278359-5b1cd980-a113-11eb-9c0a-82e77d74bf57.png" alt="Single item carousel view"/>
</h1>

- **Multiple Items Carousel**: Similar to carousel view with three items per carousel slide

<h1 align="center">
  <img src="https://user-images.githubusercontent.com/35708101/115278358-5a844300-a113-11eb-945b-b1ca40fdcbaa.png" alt="Multiple items caousel view"/>
</h1>

- **List**: Displays the items in a list

<h1 align="center">
  <img src="https://user-images.githubusercontent.com/35708101/115278356-5a844300-a113-11eb-9f9d-7f80c226d0b4.png" alt="List view"/>
</h1>

- **Gallery**: Displays the items organized in a responsive layout

<h1 align="center">
  <img src="https://user-images.githubusercontent.com/35708101/115278341-56f0bc00-a113-11eb-9ceb-9fa2ba88c641.png" alt="Gallery view"/>
</h1>

It comes with a ready to use [example](./examples/index.js) and a [NodeJS express server](./examples/server/server.js) to bootstrap integration with [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html).

## Features

- Four different layouts to show items retrieved by eBay Browse API
- Support for customizable search parameters:
  - [Search by keyword](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search)
  - [Search by image](https://developer.ebay.com/api-docs/buy/browse/resources/search_by_image/methods/searchByImage)
  - [Search by charity ID(s)](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search#uri.charity_ids)
- Option to [sort](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search#uri.sort) search results by:
  - Price (ascending)
  - Price (descending)
  - Distance
  - Newly listed
- [Limit search results with pagination control](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search#uri.limit) search results
- Surface items from different [eBay Marketplaces](https://developer.ebay.com/api-docs/buy/static/ref-marketplace-supported.html)
- Highly customizable
  - Each visible element can be hidden by passing a prop
  - API errors/warnings are displayed as alerts and can be overridden
  - The carousel layout supports different options:
    - **animation**: Defines the animation style (slide/fade)
    - **autoplay**: Defines if the slides should auto-scroll
    - **interval**: Interval in ms between slides
    - **indicators**: Defines if the bullet indicators should be visible
    - **navButtonsAlwaysInvisible**: Defines if the prev/next indicators should be always invisible
    - **navButtonsAlwaysVisible**: Defines if the prev/next indicators should be always visible
    - **stopAutoPlayOnHover**: Defines if the slides should auto-scroll on mouse over
- This widget also supports affiliate IDs and creates trackable URLs for each item.

## Usage

### Prerequisites

```sh
- NodeJS (for the example): v12.16 or higher
- NPM: v7.5.6 or higher/Yarn: v1.22.10 or higher
```

### Install

<a href="https://npmjs.org/package/ebay-items-react-widget"><img src="https://img.shields.io/npm/v/ebay-items-react-widget.svg" alt="NPM Version"/></a>  

Using npm:

```sh
npm install ebay-items-react-widget
```

Using yarn:

```sh
yarn add ebay-items-react-widget
```

## Configure

Before when running the example, make the following updates to the [options.js](./examples/server/options.js) file:

- **AFFILIATE_CAMPAIGN_ID**: This is a 10-digit unique number provided by the eBay Partner Network.
- **AFFILIATE_REFERENCE_ID**: This can be any value you want to use to identify this item or purchase order and can be a maximum of 256 characters. This is embedded in the **customid** part of the ePN affiliate link. Note: The **referenceId** is the same as SUB-ID.
- **CATEGORY_IDS**: The category ID is used to limit the results to specific eBay categories. Note: Currently, you can pass in only one category ID per request.
- **CLIENT_ID**: Your application's Client ID. [More information](https://developer.ebay.com/api-docs/static/oauth-credentials.html)
- **CLIENT_SECRET**: Your application's Client secret. [More information](https://developer.ebay.com/api-docs/static/oauth-credentials.html)
- **ENVIRONMENT**: PRODUCTION/SANDBOX

## API

| Prop                | Description                                                                                                                                                 | Type    | Default | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | -------- |
| carouselOptions             | Carousel options (only applicable when defaultView is "carousel" or "multi-item-carousel")                                                                                                                         | Object  | `{ animation: "slide", autoPlay: false, interval: 4000,  indicators: false, navButtonsAlwaysInvisible: false, navButtonsAlwaysVisible: false, stopAutoPlayOnHover: false }` | N        |
| charityIds | The Charity ID(s) are used to limit the results to only items associated with the specified charity                                                                                                     | String  | ""      | N        |
| defaultView             | Default view for the widget (carousel/multi-item-carousel/gallery/list)                                                                                                                         | String  | gallery | N        |
| disableImageSearch         | Hides the image search button                                                                                                                                     | Boolean | false   | N        |
| errorMessage | Overrides the error message                                                                                                                                | String  | ""      | N        |
| imageSearchEndpoint | Backend URL for image search                                                                                                                                | String  | ""      | Y        |
| limit               | Number of items surfaced [(documentation)](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search#uri.limit)                  | Integer | 50      | N        |
| marketplaceId       | Marketplace in which the items would be searched. [(supported marketplaces)](https://developer.ebay.com/api-docs/buy/static/ref-marketplace-supported.html) | String  | EBAY_US | N        |
| searchEndpoint      | Backend URL for keyword search                                                                                                                              | String  | ""      | Y        |
| searchKeyword      | Default search keyword (Note: Triggers search call on page load)                                                                                                                              | String  | ""      | N        |
| hideErrors | When passed this will hide the error message alerts                                                                                                                                | Boolean  | false      | N        |
| hideSearchBar         | Hide the search bar                                                                                                                                     | Boolean | false   | N        |
| hideSortOptions         | Hide the sort options button                                                                                                                                     | Boolean | false   | N        |
| hideSettings         | Hide the settings button                                                                                                                                     | Boolean | false   | N        |
| hideTotal         | Hide the total button                                                                                                                                     | Boolean | false   | N        |
| hideViewOptions         | Hide the view options button                                                                                                                                     | Boolean | false   | N        |
| hideWarnings | When passed this will hide the warning message alerts                                                                                                                                | Boolean  | false      | N        |
| warningMessage | Overrides the warning messages                                                                                                                                | String  | ""      | N        |

## Example

```js
import EbayItemsWidget from 'ebay-items-react-widget';

<EbayItemsWidget
    carouselOptions={{
        animation: 'slide',
        autoPlay: true,
        interval: 5000,
        indicators: false,
        stopAutoPlayOnHover: true
    }}
    defaultView="multi-item-carousel"
    imageSearchEndpoint="http://localhost:3001/search_by_image"
    searchEndpoint="http://localhost:3001/search"
    searchTerm="Sneakers"
/>
```

### Running the example

Using npm:

```sh
npm start
```

Using yarn:

```sh
yarn start
```

Configuration Sample: [options.js](./examples/server/options.js).

## Note for Production deployment

```lang-none
For production, please host with HTTPS enabled.
```

## Logging

Uses standard console logging.

## License

Copyright 2021 eBay Inc.
Developer: Lokesh Rishi

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<https://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
