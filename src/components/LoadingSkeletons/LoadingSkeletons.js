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
import { Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    item: {
        margin: '0 auto',
        padding: 7
    },
    listItem: {
        margin: '0 auto',
        minWidth: 205,
        height: 170
    },
    skeletonCard: {
        width: 205,
        height: 250,
        marginBottom: 20
    },
    listCard: {
        [theme.breakpoints.down('sm')]: {
            width: 160,
            height: 150
        },
        [theme.breakpoints.up('sm')]: {
            width: 250,
            height: 200
        },
        marginBottom: 20
    },
    loadingCarousel: {
        maxWidth: '40em'
    },
    multiItemCarousel: {
        maxWidth: '48em',
        minWidth: '45em'
    }
}));

export const LoadingGallery = () => {
    const classes = useStyles();
    return (
        <>
            {[...Array(15).keys()].map((index) => (
                <Grid key={index} item className={classes.item}>
                    <Skeleton variant="rect" className={classes.skeletonCard} />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton width="50%" />
                </Grid>
            ))}
        </>
    );
};

export const LoadingList = () => {
    const classes = useStyles();
    return (
        <>
            {[...Array(7).keys()].map((index) => (
                <Grid key={index} container justify="flex-start">
                    <Skeleton variant="rect" className={classes.listCard} />
                    <div
                        style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            width: '20%',
                            paddingLeft: 40
                        }}>
                        <Skeleton width="200%" />
                        <Skeleton />
                        <Skeleton width="60%" />
                    </div>
                </Grid>
            ))}
        </>
    );
};

export const LoadingCarousel = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.loadingCarousel} container justify="flex-start">
            <Skeleton variant="rect" className={classes.listCard} />
            <div
                style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    width: '20%',
                    paddingLeft: 40
                }}>
                <Skeleton width="200%" />
                <Skeleton />
                <Skeleton width="60%" />
            </div>
        </Grid>
    );
};

export const LoadingMultiItemCarousel = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.multiItemCarousel} container justify="center">
            {[...Array(3).keys()].map((index) => (
                <Grid key={index} item style={{ padding: 7 }}>
                    <Skeleton variant="rect" className={classes.skeletonCard} />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton width="50%" />
                </Grid>
            ))}
        </Grid>
    );
};
