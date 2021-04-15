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

import React from 'react';
import { render, screen } from '@testing-library/react';
import GalleryView from '../src/components/GalleryView/GalleryView';
import '@testing-library/jest-dom';

const items = require('./test.data.json').FULL.itemSummaries;

describe('GalleryView', () => {
    beforeAll(() => {
        global.fetch = require('node-fetch');
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({})
            })
        );
    });

    test('should display title', () => {
        render(<GalleryView items={items} />);
        expect(screen.getByText(items[0].title)).toBeInTheDocument();
        expect(screen.getByText(items[1].title)).toBeInTheDocument();
        expect(screen.getByText(items[2].title)).toBeInTheDocument();
    });

    test('should display price', () => {
        render(<GalleryView items={items} />);
        expect(
            screen.getByText(`${items[0].price.currency} ${items[0].price.value}`)
        ).toBeInTheDocument();
        expect(
            screen.getByText(`${items[1].price.currency} ${items[1].price.value}`)
        ).toBeInTheDocument();
        expect(
            screen.getByText(`${items[2].price.currency} ${items[2].price.value}`)
        ).toBeInTheDocument();
    });

    test('should display the thumbnail image', () => {
        render(<GalleryView items={items} />);
        expect(screen.queryByAltText(items[0].title).getAttribute('src')).toEqual(
            items[0].thumbnailImages[0].imageUrl
        );
        expect(screen.queryByAltText(items[1].title).getAttribute('src')).toEqual(
            items[1].thumbnailImages[0].imageUrl
        );
        expect(screen.queryByAltText(items[2].title).getAttribute('src')).toEqual(
            items[2].thumbnailImages[0].imageUrl
        );
    });

    test('should display the image when thumbnail is not present', () => {
        items.map((item) => (item.thumbnailImages = null));
        render(<GalleryView items={items} />);
        expect(screen.queryByAltText(items[0].title).getAttribute('src')).toEqual(
            items[0].image.imageUrl
        );
        expect(screen.queryByAltText(items[1].title).getAttribute('src')).toEqual(
            items[1].image.imageUrl
        );
        expect(screen.queryByAltText(items[2].title).getAttribute('src')).toEqual(
            items[2].image.imageUrl
        );
    });
});
