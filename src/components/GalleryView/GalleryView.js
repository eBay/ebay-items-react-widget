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
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, CardActionArea, Grid, Typography } from '@material-ui/core';

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
        padding: 7
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
        width: 230,
        height: 400
    }
}));

const GalleryView = (props) => {
    const classes = useStyles();

    useEffect(() => {
        utils.triggerImpression(props.items);
    }, [props.items]);

    return (
        props.items &&
        props.items.length > 0 &&
        props.items.map((item) => (
            <Grid key={item.itemId} className={classes.item} item>
                <Card className={classes.card} variant="outlined" square>
                    <CardActionArea
                        href={
                            (item.itemAffiliateWebUrl && `${item.itemAffiliateWebUrl}${ffParam}`) ||
                            item.itemWebUrl
                        }
                        target="_blank">
                        <Box
                            p={1}
                            style={{
                                height: 250,
                                textAlign: 'center'
                            }}>
                            <img
                                src={
                                    (item.thumbnailImages && item.thumbnailImages[0].imageUrl) ||
                                    (item.image && item.image.imageUrl) || noImage
                                }
                                className={classes.media}
                                alt={item.title}
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
                                    {item.title}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {item.price.currency} {item.price.value}
                                </Typography>
                            </CardContent>
                        </div>
                        <Logo style={{ marginTop: 'auto', marginRight: '0.5em' }} />
                    </CardActionArea>
                </Card>
            </Grid>
        ))
    );
};

export default GalleryView;
