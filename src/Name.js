import React, { Component } from "react";
import PropTypes from 'prop-types';
import './Table.css'


class Name extends Component {
    static propTypes = {
        rowData: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired
    };


    render() {
        const alias = {
            'cryptopunks':'Cryptopunks',
            'boredapeyachtclub': "Bored Ape Yacht Club",
            'veefriends': "VeeFriends",
            'meebits': "Meebits",
            'punks-comic': "Punks-Comic",
            'pudgypenguins': "Pudgy Penguins",
            'bored-ape-kennel-club': "Bored Ape Kennel Club",
            'hashmasks': "Hashmasks",
            'cool-cats-nft': "Cool Cats NFT",
            'galaxyeggs9999': "Galaxy Eggs",
            'cryptoadz-by-gremplin': "CrypToadz",
            'mutant-ape-yacht-club': "Mutant Ape Yacht Club",
            '0n1-force': "On1 Force",
            'curiocardswrapper': "My Curio Cards",
            'bored-ape-chemistry-club': "Bored Ape Chemistry Club",
            'creature-world-collection': "Creature World",
            'parallelalpha': "Parellel Alpha",
            'koala-intelligence-agency': "Koala Intelligence Agency",
            'adam-bomb-squad': "Adam Bomb Squad"
        }

        const { rowData } = this.props;
        console.log("DATA IN NAME: ")
        console.log(rowData)
        
        
        var img = null;
        if (rowData.length === 9) {
            img = rowData[8]
        }
        else {
            img = rowData[9]

        }
        return (<>
            <img src={img} class="image-snippet" alt="no img"></img>
            <a>{alias[rowData[0]]?alias[rowData[0]]:rowData[0]}</a>


        </>
        )
    }
}
export default Name;