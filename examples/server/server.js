/*
 * *
 *  * Copyright 2021 eBay Inc.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *  http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  *
 */

const xss = require('xss');
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const EbayAuthToken = require('ebay-oauth-nodejs-client');
const options = require('./options');

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3001;
const ebayAuthToken = new EbayAuthToken({
    clientId: options.CLIENT_ID,
    clientSecret: options.CLIENT_SECRET,
    env: options.ENVIRONMENT,
    redirectUri: ''
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const getAppToken = async () => {
    try {
        const token = await ebayAuthToken.getApplicationToken('PRODUCTION');
        return token && JSON.parse(token);
    } catch (error) {
        console.error(error);
    }
};

const keywordSearch = async (keywordSearchOptions) => {
    // Get the OAuth token
    const tokenResponse = await getAppToken();

    const limit = xss(keywordSearchOptions.limit);
    const searchTerm = xss(keywordSearchOptions.searchTerm);
    keywordSearchOptions.sort = xss(keywordSearchOptions.sort);
    keywordSearchOptions.marketplaceId = xss(keywordSearchOptions.marketplaceId);

    if (tokenResponse && tokenResponse.access_token) {
        let keywordSearchURL =
            keywordSearchOptions.searchURL ||
            `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${searchTerm}&limit=${limit}`;

        // If sort query parameter is provided as a part of options
        keywordSearchURL =
            keywordSearchOptions.sort !== '-'
                ? keywordSearchURL.concat(`&sort=${keywordSearchOptions.sort}`)
                : keywordSearchURL;

        // Append Charity IDs
        keywordSearchURL =
            keywordSearchOptions.charityIds &&
                keywordSearchOptions.charityIds.length > 0
                ? keywordSearchURL.concat(`&charity_ids=${keywordSearchOptions.charityIds}`)
                : keywordSearchURL;

        // Append category IDs
        keywordSearchURL =
            options.CATEGORY_IDS.length > 0
                ? keywordSearchURL.concat(`&category_ids=${options.CATEGORY_IDS}`)
                : keywordSearchURL;

        const requestConfig = {
            method: 'GET',
            url: keywordSearchURL,
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': keywordSearchOptions.marketplaceId,
                'X-EBAY-C-ENDUSERCTX': `affiliateCampaignId=${options.AFFILIATE_CAMPAIGN_ID},affiliateReferenceId=${options.AFFILIATE_REFERENCE_ID}`
            }
        };

        try {
            const apiResponse = await axios(requestConfig);
            return apiResponse;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    }
};

const imageSearch = async (imageSearchOptions) => {
    // Get the OAuth token
    const tokenResponse = await getAppToken();

    const limit = xss(imageSearchOptions.limit);
    imageSearchOptions.sort = xss(imageSearchOptions.sort);
    imageSearchOptions.marketplaceId = xss(imageSearchOptions.marketplaceId);

    if (tokenResponse && tokenResponse.access_token) {
        let imageSearchURL =
            imageSearchOptions.searchURL ||
            `https://api.ebay.com/buy/browse/v1/item_summary/search_by_image?limit=${limit}`;

        // If sort query parameter is provided as a part of options
        imageSearchURL =
            imageSearchOptions.sort !== '-'
                ? imageSearchURL.concat(`&sort=${imageSearchOptions.sort}`)
                : imageSearchURL;

        // Append Charity IDs
        imageSearchURL =
            imageSearchOptions.charityIds &&
                imageSearchOptions.charityIds.length > 0
                ? imageSearchURL.concat(`&charity_ids=${keywordSearchOptions.charityIds}`)
                : imageSearchURL;

        // Append category IDs
        imageSearchURL =
            options.CATEGORY_IDS.length > 0
                ? imageSearchURL.concat(`&category_ids=${options.CATEGORY_IDS}`)
                : imageSearchURL;

        const requestConfig = {
            method: 'POST',
            url: imageSearchURL,
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': imageSearchOptions.marketplaceId,
                'X-EBAY-C-ENDUSERCTX': `affiliateCampaignId=${options.AFFILIATE_CAMPAIGN_ID},affiliateReferenceId=${options.AFFILIATE_REFERENCE_ID}`
            },
            data: { image: imageSearchOptions.imageData }
        };

        try {
            const apiResponse = await axios(requestConfig);
            return apiResponse;
        } catch (error) {
            console.error(error);
            return error.response;
        }
    }
};

router.post('/search', (req, res) => {
    keywordSearch(req.body)
        .then((response) => res.status(200).send(response.data))
        .catch((error) => {
            console.error(error);
            res.status(500);
        });
});

router.post('/search_by_image', (req, res) => {
    imageSearch(req.body)
        .then((response) => res.status(200).send(response.data))
        .catch((error) => {
            console.error(error);
            res.status(500);
        });
});

app.use(router);

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

app.listen(PORT, console.log(`App is running, server is listening on port ${PORT}`));
