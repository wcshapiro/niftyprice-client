import React, { Component } from "react";
import PropTypes from 'prop-types';
import './Table.css'


class CellLink extends Component {
    static propTypes = {
        rowData: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired
    };


    render() {
        const { rowData} = this.props;
        const art_blocks = {

            "Subscapes": "art-blocks", //cap
            "Unigrids": "art-blocks", //cap
            "Archetype": "art-blocks", //cap
            "Elevated Deconstructions": "art-blocks", //cap
            "Singularity": "art-blocks", //cap
            "Fidenza": "art-blocks", //cap
            "Ringers": "art-blocks", //cap
            "Chromie Squiggle": "art-blocks", //cap
            "Pigments": "art-blocks", //cap
            "The Eternal Pump": "art-blocks-playground", //cap
            "27-Bit Digital": "art-blocks", //cap
            "720 Minutes": "art-blocks", //cap
            "Aerial View": "art-blocks", //cap
            "AlgoRhythms": "art-blocks", //cap
            "Algobots": "art-blocks", //cap
            "Apparitions": "art-blocks", //cap
            "Bubble Blobby": "art-blocks", //cap
            "CENTURY": "art-blocks", //cap
            "Construction Token": "art-blocks",  //cap
            "Cryptoblots": "art-blocks",  //cap
            "Dreams": "art-blocks",  //cap
            "Dynamic Slices": "art-blocks",  //cap
            "Elementals": "art-blocks",  //cap
            "Endless Nameless": "art-blocks",  //cap
            "Frammenti": "art-blocks",  //cap
            "Genesis": "art-blocks",  //cap
            "Geometry Runners": "art-blocks",  //cap
            "HyperHash": "art-blocks",  //cap
            "Ignition": "art-blocks",  //cap
            "Inspirals": "art-blocks",  //cap
            "NimBuds": "art-blocks",  //cap
            "Scribbled Boundaries": "art-blocks",  //cap
            "Spectron": "art-blocks",  //cap
            "Synapses": "art-blocks",  //cap
            "The Blocks of Art": "art-blocks",  //cap
            "Watercolor Dreams": "art-blocks",  //cap
            "glitch crystal monsters": "art-blocks", //lc
            "phase": "art-blocks", //lc
            "Alien Clock": "art-blocks-playground", //cap
            "Alien Insects": "art-blocks-playground", //cap
            "Aurora IV": "art-blocks-playground", //cap
            "Beatboxes": "art-blocks-playground", //cap
            "Color Study": "art-blocks-playground", //cap
            "Cyber Cities": "art-blocks-playground", //cap
            "Divisions": "art-blocks-playground", //cap
            "Eccentrics": "art-blocks-playground", //cap
            "Eccentrics 2: Orbits": "art-blocks-playground", //cap
            "Ecumenopolis": "art-blocks-playground", //cap
            "EnergySculpture": "art-blocks-playground", //cap
            "Gen 2": "art-blocks-playground", //cap
            "Gen 3": "art-blocks-playground", //cap
            "Hieroglyphs": "art-blocks-playground", //cap
            "Messengers": "art-blocks-playground", //cap
            "Neighborhood": "art-blocks-playground", //cap
            "Obicera": "art-blocks-playground", //cap
            "Paper Armada": "art-blocks-playground", //cap
            "Pathfinders": "art-blocks-playground", //cap
            "Pixel Glass": "art-blocks-playground", //cap
            "Portal": "art-blocks-playground", //cap
            "R3sonance": "art-blocks-playground", //cap
            "Return": "art-blocks-playground", //cap
            "Rhythm": "art-blocks-playground", //cap
            "Rinascita": "art-blocks-playground", //cap
            "Sentience": "art-blocks-playground", //cap
            "Utopia": "art-blocks-playground", //cap
            "View Card": "art-blocks-playground", //cap
            "Void": "art-blocks-playground", //cap
            "Wave Schematics": "art-blocks-playground", //cap
            // "70s Pop Ghost Bonus Pack":"art-blocks-factory",
            "70s Pop Series One": "art-blocks-factory", //cap
            "70s Pop Series Two": "art-blocks-factory", //cap
            // "70s Pop Super Fun Summertime Bonus Pack":"art-blocks-factory",
            "Abstraction": "art-blocks-factory", //cap
            "Andradite": "art-blocks-factory", //cap
            "Asterisms": "art-blocks-factory", //cap
            "Breathe You": "art-blocks-factory", //cap
            "Brushpops": "art-blocks-factory", //cap
            "Calendart": "art-blocks-factory", //cap
            "CatBlocks": "art-blocks-factory", //cap
            "Cells": "art-blocks-factory", //cap
            "Color Magic Planets": "art-blocks-factory", //cap
            "CryptoGodKing": "art-blocks-factory", //cap
            "CryptoVenetian": "art-blocks-factory", //cap
            "Dear Hash:": "art-blocks-factory", //cap
            "Dot Matrix Gradient Study": "art-blocks-factory",//cap
            "Empyrean": "art-blocks-factory", //cap
            "Enchiridion": "art-blocks-factory", //cap
            "Event Horizon Sunset (Series C)": "art-blocks-factory", //cap
            "Fake Internet Money": "art-blocks-factory", //cap
            "Flowers": "art-blocks-factory", //cap
            "Galaxiss": "art-blocks-factory", //cap
            "Gazettes": "art-blocks-factory", //cap
            "Gizmobotz": "art-blocks-factory", //cap
            "Good Vibrations": "art-blocks-factory", //cap
            "Gravity 12": "art-blocks-factory", //cap
            "Gravity Grid": "art-blocks-factory", //cap
            "Hashtractors": "art-blocks-factory", //cap
            "I Saw It in a Dream": "art-blocks-factory", //cap
            "Incantation": "art-blocks-factory", //cap
            "Labyrometry": "art-blocks-factory", //cap
            "Lava Glow": "art-blocks-factory", //cap
            "LeWitt Generator Generator": "art-blocks-factory", //cap
            "Libertad Parametrizada": "art-blocks-factory", //cap
            "Light Beams": "art-blocks-factory", //cap
            "Low Tide": "art-blocks-factory", //cap
            "Nucleus": "art-blocks-factory", //cap
            "Octo Garden": "art-blocks-factory", //cap
            "Ode to Roy": "art-blocks-factory", //cap
            "Organized Disruption": "art-blocks-factory", //cap
            "Origami Dream": "art-blocks-factory", //cap
            "Orthogone": "art-blocks-factory", //cap
            // "P:Xs":"art-blocks-factory", //cap
            "Patchwork Saguaros": "art-blocks-factory",//cap
            "Patterns of Life": "art-blocks-factory",//cap
            "PrimiDance": "art-blocks-factory",//cap
            "Radiance": "art-blocks-factory",//cap
            "Rapture": "art-blocks-factory",//cap
            "Spaghettification": "art-blocks-factory",//cap
            "SpiroFlakes": "art-blocks-factory",//cap
            "Star Flower": "art-blocks-factory",//cap
            "Stipple Sunsets": "art-blocks-factory",//cap
            "Stroming": "art-blocks-factory",//cap
            "Talking Blocks": "art-blocks-factory",//cap
            "The Liths of Sisyphus": "art-blocks-factory",//cap
            "The Opera": "art-blocks-factory",//cap
            "Timepiece": "art-blocks-factory",//cap
            "Transitions": "art-blocks-factory",//cap
            "Traversals": "art-blocks-factory",//cap
            "Unknown Signals": "art-blocks-factory",//cap
            "autoRAD": "art-blocks-factory",//cap

            "celestial cyclones": "art-blocks-factory",//lc
            "dino pals": "art-blocks-factory",//lc
            "planets": "art-blocks-factory",//lc
            "sail-o-bots": "art-blocks-factory", //lc

        };
        const collections = ['cryptopunks',
            'boredapeyachtclub',
            'veefriends',
            'meebits',
            'punks-comic', 'pudgypenguins', 'bored-ape-kennel-club', 'hashmasks', 'cool-cats-nft'];
        let link = "n";
        if (collections.includes(rowData[0])) {
            link = "https://opensea.io/collection/" + rowData[0] + "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&collectionSlug=" + rowData[0] + "&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW"
        }
        else {
            let plural = rowData[0].slice(-1) === "s" ? rowData[0] : rowData[0] + "s";
            link = "https://opensea.io/assets/" + art_blocks[rowData[0]] + "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&search[stringTraits][0][name]=" + rowData[0] + "&search[stringTraits][0][values][0]=All%20" + plural + "&search[toggles][0]=BUY_NOW&search[sortAscending]=true&search[sortBy]=PRICE"
        }
        return (<>
        <div class="links">
        <a class="graph-link"> </a>
            <a class="opensea-link" href={link}> </a>
        </div>
            

        </>
        )
    }
}
export default CellLink;