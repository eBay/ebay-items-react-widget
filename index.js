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

import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ListView from './src/components/ListView/ListView';
import GalleryView from './src/components/GalleryView/GalleryView';
import CarouselView from './src/components/CarouselView/CarouselView';
import MultiItemCarouselView from './src/components/MultiItemCarouselView/MultiItemCarouselView';

import { Alert, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import {
    allowedMarketplaces,
    defaultErrorMessage,
    primaryColor,
    sortingOptions,
    headers
} from './src/common/Constants';
import { makeStyles } from '@material-ui/core/styles';

import {
    LoadingCarousel,
    LoadingGallery,
    LoadingList,
    LoadingMultiItemCarousel
} from './src/components/LoadingSkeletons/LoadingSkeletons';

import {
    PhotoCamera,
    Settings,
    ViewCarousel,
    ViewColumn,
    ViewList,
    ViewModule
} from '@material-ui/icons';

import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    List,
    ListItem,
    ListItemText,
    Divider,
    Slider,
    Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    alert: {
        marginBottom: 5
    },
    searchBar: {
        maxWidth: 584,
        padding: '2px 4px',
        position: 'relative',
        width: '100%'
    },
    optionsBox: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '3%',
            paddingRight: '3%'
        },
        [theme.breakpoints.up('md')]: {
            paddingLeft: '15%',
            paddingRight: '15%'
        },
        margin: '0 auto',
        marginBottom: 30
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        height: 48,
        width: '90%'
    },
    galleryContainer: {
        padding: 20
    },
    listContainer: {
        padding: 10,
        maxWidth: 725,
        margin: '0 auto'
    },
    divider: {
        height: 28,
        margin: 4
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    imageInput: {
        display: 'none'
    },
    separator: {
        [theme.breakpoints.up('sm')]: {
            borderRight: '0.1em solid #ebebeb'
        },
        marginLeft: 9,
        marginRight: 9
    },
    primaryColor: {
        color: primaryColor
    },
    widthAuto: {
        width: 'auto'
    },
    carousel: {
        margin: '0 auto',
        padding: 10
    },
    totalContainer: {
        paddingBottom: 10
    }
}));

const marks = [
    {
        value: 10,
        label: '10'
    },
    {
        value: 50,
        label: '50'
    },
    {
        value: 100,
        label: '100'
    },
    {
        value: 150,
        label: '150'
    },
    {
        value: 200,
        label: '200'
    }
];

/**
 * Add commas to the given number
 * @param {Integer} number
 * @returns String
 */
const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

const EbaySearchBar = (props) => {
    const classes = useStyles();
    let fileInput = createRef();
    const [sort, setSort] = useState('-');
    const [items, setItems] = useState([]);
    const [errors, setErrors] = useState([]);
    const [prevUrl, setPrevUrl] = useState('');
    const [nextUrl, setNextUrl] = useState('');
    const [total, setTotal] = React.useState(0);
    const [warnings, setWarnings] = useState([]);
    const [offset, setOffset] = React.useState(0);
    const [imageData, setImageData] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [settingsDrawer, setSettingsDrawer] = useState(false);
    const [limit, setLimit] = useState(props.limit || 50);
    const [view, setView] = useState(props.defaultView || 'gallery');
    const [marketplaceId, setMarketplaceId] = useState(props.marketplaceId || 'EBAY_US');

    useEffect(() => {
        if (searchTerm.length > 0) {
            handleKeywordSearch();
        } else if (imageData.length > 0) {
            handleImageSearch();
        }
    }, [sort, marketplaceId]);

    useEffect(() => {
        props.searchKeyword && props.searchKeyword.length > 0 && handleKeywordSearch();
    }, [props.searchKeyword]);

    const toggleOptionsBox = () => {
        setSettingsDrawer(!settingsDrawer);
    };

    const handleLimitChange = (event, newValue) => {
        setLimit(newValue);
    };

    const handleMarketplaceChange = (event) => {
        setMarketplaceId(event.target.value);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const handleViewChange = (event, nextView) => {
        setView(nextView);
    };

    const handleWarnings = (response) => {
        const warningsArr = [];
        if (response.warnings && response.warnings.length > 0) {
            props.warningMessage
                ? warningsArr.push(props.warningMessage)
                : response.warnings.map((warning) => warningsArr.push(warning.message));
        }
        setWarnings(warningsArr);
    };

    const handleError = (response) => {
        const errorsArr = [];
        if (props.errorMessage) {
            errorsArr.push(props.errorMessage);
        } else {
            if (response.errors && response.errors.length > 0) {
                response.errors.map((error) => errorsArr.push(error.message));
            } else {
                errorsArr.push(defaultErrorMessage);
            }
        }
        setErrors(errorsArr);
        setItems([]);
    };

    const clearErrorsAndWarnings = () => {
        setErrors([]);
        setWarnings([]);
    };

    const handleKeywordSearch = (apiUrl) => {
        clearErrorsAndWarnings();
        if (searchTerm.length > 0 || (props.searchKeyword && props.searchKeyword.length > 0)) {
            setSettingsDrawer(false);
            setLoading(true);

            fetch(props.searchEndpoint, {
                method: 'POST',
                headers: headers.applicationJson,
                body: JSON.stringify({
                    charityIds: props.charityIds,
                    limit: limit,
                    marketplaceId: marketplaceId,
                    searchTerm: searchTerm || props.searchKeyword,
                    searchURL: apiUrl,
                    sort: sort
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        if (result && result.itemSummaries) {
                            setItems(result.itemSummaries);
                            setTotal(result.total);
                            setOffset(result.offset);
                            handleWarnings(result);
                            setPrevUrl(result.prev);
                            setNextUrl(result.next);
                        } else {
                            handleError(result);
                        }
                        setLoading(false);

                        // Set the searchKeyword as searchTerm if its empty
                        (!searchTerm || searchTerm.length < 1) &&
                            props.searchKeyword && setSearchTerm(props.searchKeyword);
                    },
                    (error) => {
                        handleError(error);
                        setLoading(false);
                    }
                );
        }
    };

    const handleImageSearch = (apiUrl, image) => {
        clearErrorsAndWarnings();
        setSettingsDrawer(false);
        setLoading(true);
        fetch(props.imageSearchEndpoint, {
            method: 'POST',
            headers: headers.applicationJson,
            body: JSON.stringify({
                charityIds: props.charityIds,
                imageData: (imageData && imageData.length > 0 && imageData) || image,
                limit: limit,
                marketplaceId: marketplaceId,
                searchTerm: searchTerm,
                searchURL: apiUrl,
                sort: sort
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    if (result && result.itemSummaries) {
                        setItems(result.itemSummaries);
                        setTotal(result.total);
                        setOffset(result.offset);
                        handleWarnings(result);
                        setPrevUrl(result.prev);
                        setNextUrl(result.next);
                    } else {
                        handleError(result);
                    }
                    setLoading(false);
                },
                (error) => {
                    handleError(error);
                    setLoading(false);
                }
            );
    };

    const handleImageUpload = () => {
        const { files } = fileInput.current;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                if (reader.result && reader.result.split(',').length > 1) {
                    const imageData = reader.result.split(',')[1];
                    setImageData(imageData);
                    setTimeout(() => {
                        handleImageSearch(null, imageData);
                    }, 300);
                    setSearchTerm('');
                    document.getElementById('icon-button-file').value = '';
                    fileInput = {};
                }
            };
            reader.onerror = (error) => {
                setErrors(error);
            };
        }
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleKeywordSearch();
        }
    };

    return (
        <>
            {!props.hideErrors && (
                <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                    <Collapse in={errors.length > 0} mountOnEnter unmountOnExit>
                        {errors.map((error, index) => (
                            <Alert key={index} severity="error" className={classes.alert}>
                                {error}
                            </Alert>
                        ))}
                    </Collapse>
                </Box>
            )}

            {!props.hideWarnings && (
                <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                    <Collapse in={warnings.length > 0} mountOnEnter unmountOnExit>
                        {warnings.map((warning, index) => (
                            <Alert key={index} severity="warning" className={classes.alert}>
                                {warning}
                            </Alert>
                        ))}
                    </Collapse>
                </Box>
            )}

            {!props.hideSearchBar && (
                <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                    <Paper component="form" className={classes.searchBar}>
                        <InputBase
                            className={classes.input}
                            inputProps={{ 'aria-label': 'search ebay' }}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Search eBay"
                            value={searchTerm}
                        />
                        <div style={{ display: 'inline-block', position: 'absolute', right: 0 }}>
                            {!props.disableImageSearch && (
                                <>
                                    <input
                                        accept="image/*"
                                        className={classes.imageInput}
                                        id="icon-button-file"
                                        type="file"
                                        onChange={handleImageUpload}
                                        ref={fileInput}
                                        data-testid="image-upload"
                                    />
                                    <label htmlFor="icon-button-file">
                                        <IconButton
                                            color="primary"
                                            aria-label="upload picture"
                                            component="span">
                                            <PhotoCamera className={classes.primaryColor} />
                                        </IconButton>
                                    </label>
                                </>
                            )}
                            {!props.hideSettings && (
                                <IconButton
                                    color="primary"
                                    onClick={toggleOptionsBox}
                                    aria-label="options">
                                    <Settings className={classes.primaryColor} />
                                </IconButton>
                            )}
                        </div>
                    </Paper>
                </Box>
            )}
            <Collapse in={settingsDrawer} mountOnEnter unmountOnExit className={classes.optionsBox}>
                <Paper style={{ padding: 15 }} variant="outlined" square>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem>
                            <ListItemText primary="Change eBay site" />
                            <FormControl variant="outlined">
                                <InputLabel
                                    id="marketplace-select-label"
                                    className={classes.primaryColor}>
                                    Marketplace
                                </InputLabel>
                                <Select
                                    labelId="marketplace-select-label"
                                    id="marketplace-select"
                                    value={marketplaceId}
                                    onChange={handleMarketplaceChange}
                                    label="Marketplace">
                                    {allowedMarketplaces.map((marketplace) => (
                                        <MenuItem key={marketplace.id} value={marketplace.id}>
                                            {marketplace.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Number of results" />
                            <Slider
                                aria-labelledby="discrete-slider-small-steps"
                                defaultValue={limit}
                                step={10}
                                min={10}
                                max={200}
                                marks={marks}
                                onChange={handleLimitChange}
                                valueLabelDisplay="auto"
                                className={classes.primaryColor}
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Collapse>
            {items && items.length > 0 && (
                <Grid alignItems="center" container direction="row" justify="space-between">
                    {!props.hideTotal && (
                        <Typography className={classes.totalContainer}>
                            <>
                                Showing {offset + 1}-
                                {limit + offset > total ? total : limit + offset} of{' '}
                                {total && numberWithCommas(total)}
                            </>
                        </Typography>
                    )}
                    <Grid
                        className={!props.hideTotal && classes.widthAuto}
                        container
                        justify="flex-end">
                        {!props.hideSortOptions && (
                            <FormControl variant="outlined">
                                <InputLabel id="sort-select-label">Sort by</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    id="sort-select"
                                    value={sort}
                                    onChange={handleSortChange}
                                    label="Sort by">
                                    {sortingOptions.map((sortOption) => (
                                        <MenuItem key={sortOption.id} value={sortOption.id}>
                                            {sortOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {!props.hideSortOptions && !props.hideViewOptions && (
                            <div className={classes.separator}> </div>
                        )}
                        {!props.hideViewOptions && (
                            <ToggleButtonGroup value={view} exclusive onChange={handleViewChange}>
                                <ToggleButton value="carousel" aria-label="carousel view">
                                    <ViewCarousel />
                                </ToggleButton>
                                <ToggleButton
                                    value="multi-item-carousel"
                                    aria-label="multi item carousel view">
                                    <ViewColumn />
                                </ToggleButton>
                                <ToggleButton value="list" aria-label="list view">
                                    <ViewList />
                                </ToggleButton>
                                <ToggleButton value="gallery" aria-label="gallery view">
                                    <ViewModule />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        )}
                    </Grid>
                </Grid>
            )}
            {view === 'gallery' && (
                <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    className={classes.galleryContainer}>
                    {isLoading ? <LoadingGallery /> : <GalleryView items={items} />}
                </Grid>
            )}
            {view === 'list' && (
                <Grid
                    container
                    alignItems="flex-start"
                    justify="flex-start"
                    className={classes.listContainer}>
                    {isLoading ? <LoadingList /> : <ListView items={items} />}
                </Grid>
            )}
            {view === 'carousel' && (
                <Grid container alignItems="center" justify="center" className={classes.carousel}>
                    {isLoading ? (
                        <LoadingCarousel />
                    ) : (
                        <CarouselView carouselOptions={props.carouselOptions} items={items} />
                    )}
                </Grid>
            )}
            {view === 'multi-item-carousel' && (
                <Grid container alignItems="center" justify="center" className={classes.carousel}>
                    {isLoading ? (
                        <LoadingMultiItemCarousel />
                    ) : (
                        <MultiItemCarouselView
                            carouselOptions={props.carouselOptions}
                            items={items}
                        />
                    )}
                </Grid>
            )}

            {items && items.length > 0 && view !== 'carousel' && view !== 'multi-item-carousel' && (
                <Box display="flex" justifyContent="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button
                            disabled={!prevUrl || prevUrl.length === 0}
                            onClick={() =>
                                searchTerm && searchTerm.length > 0
                                    ? handleKeywordSearch(prevUrl)
                                    : handleImageSearch(prevUrl, null)
                            }>
                            Prev
                        </Button>
                        <Button
                            disabled={
                                !nextUrl ||
                                nextUrl.length === 0 ||
                                offset >= total ||
                                limit + offset > total
                            }
                            onClick={() =>
                                searchTerm && searchTerm.length > 0
                                    ? handleKeywordSearch(nextUrl)
                                    : handleImageSearch(nextUrl, null)
                            }>
                            Next
                        </Button>
                    </ButtonGroup>
                </Box>
            )}
        </>
    );
};

EbaySearchBar.propTypes = {
    carouselOptions: PropTypes.shape({
        animation: PropTypes.string,
        autoPlay: PropTypes.bool,
        interval: PropTypes.number,
        indicators: PropTypes.bool,
        navButtonsAlwaysInvisible: PropTypes.bool,
        navButtonsAlwaysVisible: PropTypes.bool,
        stopAutoPlayOnHover: PropTypes.bool
    }),
    charityIds: PropTypes.string,
    defaultView: PropTypes.string,
    disableImageSearch: PropTypes.bool,
    errorMessage: PropTypes.string,
    hideErrors: PropTypes.bool,
    hideSearchBar: PropTypes.bool,
    hideSettings: PropTypes.bool,
    hideSortOptions: PropTypes.bool,
    hideTotal: PropTypes.bool,
    hideViewOptions: PropTypes.bool,
    hideWarnings: PropTypes.bool,
    imageSearchEndpoint: PropTypes.string.isRequired,
    limit: PropTypes.number,
    marketplaceId: PropTypes.string,
    searchEndpoint: PropTypes.string.isRequired,
    searchKeyword: PropTypes.string,
    warningMessage: PropTypes.string
};

export default EbaySearchBar;
