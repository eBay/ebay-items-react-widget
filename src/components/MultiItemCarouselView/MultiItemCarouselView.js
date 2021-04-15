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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Grid, Typography, CardActionArea } from '@material-ui/core';

import Logo from '../Logo/Logo';
import { ffParam } from '../../common/Constants';
import noImage from '../Logo/image_not_available.gif';
const utils = require('../../common/Utils');

const useStyles = makeStyles(() => ({
    content: {
        flex: '1 0 auto'
    },
    details: {
        flexDirection: 'column'
    },
    item: {
        margin: '0 auto',
        padding: 7,
        display: 'inline-block',
        verticalAlign: 'top'
    },
    media: {
        width: 'auto',
        height: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        verticalAlign: 'middle',
        display: 'inline-block'
    },
    card: {
        display: 'flex',
        width: 224,
        height: 340
    },
    carousel: {
        position: 'relative',
        minWidth: '45em'
    }
}));

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
function chunkArray(myArray, chunkSize) {
    const results = [];
    for (let i = 0; i < myArray.length; i++) {
        const last = results[results.length - 1];
        if (!last || last.length === chunkSize) {
            results.push([myArray[i]]);
        } else {
            last.push(myArray[i]);
        }
    }
    return results;
}

const MultiItemCarouselView = (props) => {
    const classes = useStyles();
    const [chunkedItems, setChunkedItems] = useState([]);

    useEffect(() => {
        utils.triggerImpression(props.items);
    }, [props.items]);

    useEffect(() => {
        props.items && setChunkedItems(chunkArray(props.items, 3));
        return () => {
            setChunkedItems([]);
        };
    }, [props.items]);

    return (
        chunkedItems && (
            <Carousel
                animation={(props.carouselOptions && props.carouselOptions.animation) || 'slide'}
                autoPlay={props.carouselOptions && props.carouselOptions.autoPlay}
                className={classes.carousel}
                interval={(props.carouselOptions && props.carouselOptions.interval) || 4000}
                indicators={props.carouselOptions && props.carouselOptions.indicators}
                navButtonsAlwaysInvisible={
                    props.carouselOptions && props.carouselOptions.navButtonsAlwaysInvisible
                }
                navButtonsAlwaysVisible={
                    props.carouselOptions && props.carouselOptions.navButtonsAlwaysVisible
                }
                stopAutoPlayOnHover={
                    props.carouselOptions && props.carouselOptions.stopAutoPlayOnHover
                }>
                {chunkedItems.map((items, i) => (
                    <div key={i}>
                        {items[0] && <Item key={`${i}0`} item={items[0]} />}
                        {items[1] && <Item key={`${i}1`} item={items[1]} />}
                        {items[2] && <Item key={`${i}2`} item={items[2]} />}
                    </div>
                ))}
            </Carousel>
        )
    );
};

const Item = (props) => {
    const classes = useStyles();

    return (
        props.item && (
            <Grid key={props.item.itemId} className={classes.item} item>
                <Card className={classes.card} variant="outlined" square>
                    <CardActionArea
                        href={
                            (props.item.itemAffiliateWebUrl &&
                                `${props.item.itemAffiliateWebUrl}${ffParam}`) ||
                            props.item.itemWebUrl
                        }
                        target="_blank">
                        <Box
                            p={1}
                            style={{
                                height: 200,
                                textAlign: 'center'
                            }}>
                            <img
                                src={
                                    (props.item.thumbnailImages &&
                                        props.item.thumbnailImages[0].imageUrl) ||
                                    (props.item.image && props.item.image.imageUrl) ||
                                    noImage
                                }
                                className={classes.media}
                                alt={props.item.title}
                            />
                        </Box>
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                    gutterBottom
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                    {props.item.title}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {props.item.price.currency} {props.item.price.value}
                                </Typography>
                            </CardContent>
                        </div>
                        <Logo style={{ marginTop: '-0.7em', marginRight: '0.7em' }} />
                    </CardActionArea>
                </Card>
            </Grid>
        )
    );
};

Item.propTypes = {
    item: PropTypes.object
};

MultiItemCarouselView.propTypes = {
    carouselOptions: PropTypes.shape({
        animation: PropTypes.string,
        autoPlay: PropTypes.bool,
        interval: PropTypes.number,
        indicators: PropTypes.bool,
        navButtonsAlwaysInvisible: PropTypes.bool,
        navButtonsAlwaysVisible: PropTypes.bool,
        stopAutoPlayOnHover: PropTypes.bool
    }),
    items: PropTypes.array
};

export default MultiItemCarouselView;
