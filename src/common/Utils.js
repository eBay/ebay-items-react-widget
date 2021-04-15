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

const constants = require('./Constants');

const ebayAdServicesUrl = 'https://www.ebayadservices.com/marketingtracking/v1/impression';

const generateUrl = (url) => {
    const regex = /(https?:\/\/.*?\?)/gi;
    let response = '';
    let link = regex.exec(url);

    if (link !== null) {
        response = url.replace(link[0], `${ebayAdServicesUrl}?`);
        response = response.replace('mkevt=1', 'mkevt=2');
        response += constants.ffParam;
    }

    return response;
};

const triggerImpression = (items) => {
    if (items && items.length > 0 && items[0].itemAffiliateWebUrl) {
        fetch(generateUrl(items[0].itemAffiliateWebUrl), { mode: 'no-cors' });
    }
};

module.exports = { triggerImpression };
