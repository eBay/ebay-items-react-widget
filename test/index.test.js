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
import 'babel-polyfill';
import { configure } from 'enzyme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EbaySearchBar from '../index';
import '@testing-library/jest-dom';
import Adapter from 'enzyme-adapter-react-16';
import { ffParam } from '../src/common/Constants';

const testData = require('./test.data.json');

global.fetch = require('node-fetch');
configure({ adapter: new Adapter() });

describe('EbaySearchBar', () => {
    describe('When invalid input is prvided', () => {
        test('should render with no props', () => {
            render(
                <EbaySearchBar
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );
            expect(screen.getByPlaceholderText('Search eBay')).toBeInTheDocument();
            expect(screen.getByLabelText('upload picture')).toBeInTheDocument();
            expect(screen.getByLabelText('options')).toBeInTheDocument();
        });

        test('should not render search bar when hideSearchBar is present', () => {
            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    hideSearchBar
                    searchEndpoint="http://localhost:3001/search"
                />
            );
            expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('upload picture')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('options')).not.toBeInTheDocument();
        });
    });

    describe('When searchKeyword is provided', () => {
        test('should show an error message when API call fails', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => {}
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText('No matching items found');
            });
        });

        test('should show an error message when API returns empty response', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve({})
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText('No matching items found');
            });
        });

        test('should show an error message when itemSummaries is empty', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => testData.NO_ITEMS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText('No matching items found');
            });
        });

        test('should show an alert with the error message when error is returned', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.API_ERROR
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText(
                    "The call must have a valid 'q', 'category_ids', 'charity_ids', 'epid' or 'gtin' query parameter."
                );
            });
        });

        test('should override default error message', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => testData.NO_ITEMS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    errorMessage="Something went wrong"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText('Something went wrong');
            });
        });

        test('should override the error message returned by the API', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.API_ERROR
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    errorMessage="Something went wrong"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText('Something went wrong');
            });
        });

        test('should show multiple alerts with the warning messages', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL_WITH_WARNINGS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText(
                    'The priceCurrency filter value is invalid. For the valid values, refer to the API call documentation.'
                );
                screen.getByText(
                    "A valid 'price' filter and a valid 'priceCurrency' filter is necessary to filter based on price."
                );
            });
        });

        test('should override the warning messages returned by the API', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL_WITH_WARNINGS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                    warningMessage="Something is not right"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();
                screen.getByText('Something is not right');
            });
        });

        test('should display all the expected elements', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    limit={9}
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                // Search bar
                expect(screen.queryByPlaceholderText('Search eBay')).toBeInTheDocument();

                // Limit and total
                expect(screen.getByText('Showing 1-9 of 555,666')).toBeInTheDocument();

                // Views
                expect(screen.getByLabelText('carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('multi item carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('gallery view')).toBeInTheDocument();
                expect(screen.getByLabelText('list view')).toBeInTheDocument();

                // View should be 'gallery'
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('false');

                // Sort option
                expect(screen.getByText('Best Match')).toBeInTheDocument();

                // Image search
                expect(screen.getByLabelText('upload picture')).toBeInTheDocument();

                // Options
                expect(screen.getByLabelText('options')).toBeInTheDocument();
            });
        });

        test('should trigger search - gallery', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - multi-item-carousel', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="multi-item-carousel"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('true');

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - list', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="list"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - carousel', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="carousel"
                    hideSearchBar
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    searchKeyword="Testing"
                />
            );

            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search eBay')).not.toBeInTheDocument();

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });
    });

    describe('When searchKeyword is not provided', () => {
        test('should trigger search when "Enter" key is pressed', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                // Search bar
                expect(searchBar).toBeInTheDocument();

                // Limit and total
                expect(screen.getByText('Showing 1-50 of 555,666')).toBeInTheDocument();

                // Views
                expect(screen.getByLabelText('carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('multi item carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('gallery view')).toBeInTheDocument();
                expect(screen.getByLabelText('list view')).toBeInTheDocument();

                // View should be 'gallery'
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('false');

                // Sort option
                expect(screen.getByText('Best Match')).toBeInTheDocument();

                // Image search
                expect(screen.getByLabelText('upload picture')).toBeInTheDocument();

                // Options
                expect(screen.getByLabelText('options')).toBeInTheDocument();
            });
        });

        test('should show an error message when API call fails', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => {}
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');
                screen.getByText('No matching items found');
            });
        });

        test('should show an error message when API returns empty response', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve({})
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');
                screen.getByText('No matching items found');
            });
        });

        test('should show an error message when itemSummaries is empty', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => testData.NO_ITEMS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');
                screen.getByText('No matching items found');
            });
        });

        test('should show an alert with the error message when error is returned', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.API_ERROR
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                screen.getByText(
                    "The call must have a valid 'q', 'category_ids', 'charity_ids', 'epid' or 'gtin' query parameter."
                );
            });
        });

        test('should override default error message', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => testData.NO_ITEMS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    errorMessage="Something went wrong"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                screen.getByText('Something went wrong');
            });
        });

        test('should override the error message returned by the API', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.API_ERROR
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    errorMessage="Something went wrong"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                screen.getByText('Something went wrong');
            });
        });

        test('should show multiple alerts with the warning messages', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL_WITH_WARNINGS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                screen.getByText(
                    'The priceCurrency filter value is invalid. For the valid values, refer to the API call documentation.'
                );
                screen.getByText(
                    "A valid 'price' filter and a valid 'priceCurrency' filter is necessary to filter based on price."
                );
            });
        });

        test('should override the warning messages returned by the API', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL_WITH_WARNINGS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    warningMessage="Something is not right"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                screen.getByText('Something is not right');
            });
        });

        test('should display all the expected elements', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    limit={9}
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                // Search bar
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                // Limit and total
                expect(screen.getByText('Showing 1-9 of 555,666')).toBeInTheDocument();

                // Views
                expect(screen.getByLabelText('carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('multi item carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('gallery view')).toBeInTheDocument();
                expect(screen.getByLabelText('list view')).toBeInTheDocument();

                // View should be 'gallery'
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('false');

                // Sort option
                expect(screen.getByText('Best Match')).toBeInTheDocument();

                // Image search
                expect(screen.getByLabelText('upload picture')).toBeInTheDocument();

                // Options
                expect(screen.getByLabelText('options')).toBeInTheDocument();
            });
        });

        test('should trigger search - gallery', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - multi-item-carousel', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="multi-item-carousel"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('true');

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - list', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="list"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - carousel', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="carousel"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const searchBar = screen.queryByPlaceholderText('Search eBay');

            fireEvent.change(searchBar, { target: { value: 'Some keyword' } });
            fireEvent.keyDown(searchBar, { key: 'Enter', code: 'Enter', keyCode: 13 });

            await waitFor(() => {
                expect(searchBar).toBeInTheDocument();
                expect(searchBar.getAttribute('value')).toBe('Some keyword');

                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });
    });

    describe('When image is provided', () => {
        test('should show an error message when API call fails', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => {}
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText('No matching items found');
            });
        });

        test('should show an error message when API returns empty response', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve({})
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText('No matching items found');
            });
        });

        test('should show an error message when itemSummaries is empty', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => testData.NO_ITEMS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText('No matching items found');
            });
        });

        test('should show an alert with the error message when error is returned', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.API_ERROR
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText(
                    "The call must have a valid 'q', 'category_ids', 'charity_ids', 'epid' or 'gtin' query parameter."
                );
            });
        });

        test('should override default error message', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject({
                    json: () => testData.NO_ITEMS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="multi-item-carousel"
                    errorMessage="Something went wrong"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText('Something went wrong');
            });
        });

        test('should override the error message returned by the API', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.API_ERROR
                })
            );

            render(
                <EbaySearchBar
                    defaultView="carousel"
                    errorMessage="Something went wrong"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText('Something went wrong');
            });
        });

        test('should show multiple alerts with the warning messages', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL_WITH_WARNINGS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="list"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText(
                    'The priceCurrency filter value is invalid. For the valid values, refer to the API call documentation.'
                );
                screen.getByText(
                    "A valid 'price' filter and a valid 'priceCurrency' filter is necessary to filter based on price."
                );
            });
        });

        test('should override the warning messages returned by the API', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL_WITH_WARNINGS
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                    warningMessage="Something is not right"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                screen.getByText('Something is not right');
            });
        });

        test('should display all the expected elements', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                // Search bar
                expect(imageSearchIcon).toBeInTheDocument();

                // Limit and total
                expect(screen.getByText('Showing 1-50 of 555,666')).toBeInTheDocument();

                // Views
                expect(screen.getByLabelText('carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('multi item carousel view')).toBeInTheDocument();
                expect(screen.getByLabelText('gallery view')).toBeInTheDocument();
                expect(screen.getByLabelText('list view')).toBeInTheDocument();

                // View should be 'gallery'
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'false'
                );
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('false');

                // Sort option
                expect(screen.getByText('Best Match')).toBeInTheDocument();

                // Image search
                expect(screen.getByLabelText('upload picture')).toBeInTheDocument();

                // Options
                expect(screen.getByLabelText('options')).toBeInTheDocument();
            });
        });

        test('should trigger search - gallery', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="gallery"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('gallery view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - multi-item-carousel', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="multi-item-carousel"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(
                    screen.getByLabelText('multi item carousel view').getAttribute('aria-pressed')
                ).toBe('true');

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - list', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="list"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('list view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });

        test('should trigger search - carousel', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => testData.FULL
                })
            );

            render(
                <EbaySearchBar
                    defaultView="carousel"
                    hideSettings
                    hideSortOptions
                    hideTotal
                    imageSearchEndpoint="http://localhosst:3001/search_by_image"
                    searchEndpoint="http://localhost:3001/search"
                />
            );

            const imageSearchIcon = screen.getByTestId('image-upload');

            fireEvent.change(imageSearchIcon, {
                target: {
                    files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
                }
            });

            await waitFor(() => {
                // Get all the links
                const links = screen.getAllByRole('link');

                // View
                expect(screen.getByLabelText('carousel view').getAttribute('aria-pressed')).toBe(
                    'true'
                );

                for (let i = 0; i < links.length; i++) {
                    // Assert item title
                    expect(
                        screen.getByText(testData.FULL.itemSummaries[i].title)
                    ).toBeInTheDocument();

                    // Assert item title
                    screen.getByText(
                        `${testData.FULL.itemSummaries[i].price.currency} ${testData.FULL.itemSummaries[i].price.value}`
                    );

                    // Assert image URL
                    expect(
                        screen
                            .queryByAltText(testData.FULL.itemSummaries[i].title)
                            .getAttribute('src')
                    ).toEqual(testData.FULL.itemSummaries[i].thumbnailImages[0].imageUrl);

                    // Assert href
                    expect(
                        `${testData.FULL.itemSummaries[i].itemAffiliateWebUrl}${ffParam}`
                    ).toEqual(links[i].getAttribute('href'));
                }
            });
        });
    });
});
