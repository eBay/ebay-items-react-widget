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

import React, { useEffect } from 'react';
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
        flexDirection: 'column',
        width: '100%'
    },
    media: {
        width: 'auto',
        height: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        verticalAlign: 'middle',
        display: 'inline-block'
    },
    mediaContainer: {
        minWidth: 125,
        height: 170,
        textAlign: 'center'
    },
    card: {
        marginBottom: 10,
        width: '100%',
        height: 200
    },
    helper: {
        display: 'inline-block',
        height: '100%',
        verticalAlign: 'middle'
    },
    carousel: {
        overflow: 'initial',
        padding: 10,
        maxWidth: '40em',
        minWidth: '26em'
    }
}));

const CarouselView = (props) => {
    const classes = useStyles();

    useEffect(() => {
        utils.triggerImpression(props.items);
    }, [props.items]);

    return (
        props.items &&
        props.items.length > 0 && (
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
                {props.items.map((item, i) => (
                    <Item key={i} item={item} />
                ))}
            </Carousel>
        )
    );
};

const Item = (props) => {
    const classes = useStyles();

    return (
        props.item && (
            <Grid
                key={props.item.itemId}
                container
                direction="column"
                justify="flex-start"
                alignItems="center">
                <Card className={classes.card} variant="outlined" square>
                    <CardActionArea
                        href={
                            (props.item.itemAffiliateWebUrl &&
                                `${props.item.itemAffiliateWebUrl}${ffParam}`) ||
                            props.item.itemWebUrl
                        }
                        target="_blank">
                        <Box
                            display="flex"
                            flexWrap="nowrap"
                            p={1}
                            m={1}
                            style={{
                                paddingBottom: 0,
                                paddingTop: 0,
                                paddingLeft: 30,
                                paddingRight: 30
                            }}>
                            <Box p={1} className={classes.mediaContainer}>
                                <span className={classes.helper}></span>
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
                            <Box p={1} className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                        gutterBottom
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                        {props.item.title}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {props.item.price.currency} {props.item.price.value}
                                    </Typography>
                                </CardContent>
                            </Box>
                            <Logo
                                style={{
                                    marginBottom: '1em',
                                    marginRight: '-1.7em',
                                    marginTop: 'auto'
                                }}
                            />
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
        )
    );
};

CarouselView.propTypes = {
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

Item.propTypes = {
    item: PropTypes.object
};

export default CarouselView;
